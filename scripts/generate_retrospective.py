#!/usr/bin/env python3
"""
주간 회고록 자동 생성 스크립트

Jira API를 통해 지난 주 이슈를 조회하고 마크다운 회고록을 생성합니다.
"""

import os
import sys
import requests
from datetime import datetime, timedelta
from dateutil import parser as date_parser
from collections import defaultdict
from pathlib import Path


class JiraClient:
    """Jira REST API 클라이언트"""

    def __init__(self, base_url: str, email: str, api_token: str):
        # URL에 https://가 이미 포함되어 있는 경우 처리
        if base_url.startswith("https://") or base_url.startswith("http://"):
            self.base_url = base_url.rstrip("/")
        else:
            self.base_url = f"https://{base_url}"
        self.auth = (email, api_token)
        self.headers = {"Accept": "application/json"}

    def search_issues(self, jql: str, fields: list = None, max_results: int = 100) -> list:
        """JQL로 이슈 검색"""
        # 새로운 API 엔드포인트 사용 (v2 search는 제거됨)
        # https://developer.atlassian.com/changelog/#CHANGE-2046
        url = f"{self.base_url}/rest/api/3/search/jql"

        # JQL에서 줄바꿈 제거 (URL 인코딩 문제 방지)
        clean_jql = " ".join(jql.split())

        params = {
            "jql": clean_jql,
            "maxResults": max_results,
            "fields": ",".join(fields or ["summary", "description", "status", "issuetype", "priority", "labels", "updated", "comment"])
        }

        response = requests.get(url, auth=self.auth, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json().get("issues", [])


class RetrospectiveGenerator:
    """회고록 생성기"""

    def __init__(self, jira_client: JiraClient, assignee: str, output_dir: str):
        self.jira = jira_client
        self.assignee = assignee
        self.output_dir = Path(output_dir)

    def get_date_range(self, reference_date: datetime = None, days: int = 7) -> tuple:
        """현재 날짜 기준 지난 N일 날짜 범위 계산

        Args:
            reference_date: 기준 날짜 (기본값: 오늘)
            days: 조회할 일수 (기본값: 7일)

        Returns:
            (시작일, 종료일) 튜플 - 종료일은 어제
        """
        if reference_date is None:
            reference_date = datetime.now()

        # 어제를 종료일로, 그로부터 days일 전을 시작일로
        end_date = reference_date.date() - timedelta(days=1)
        start_date = end_date - timedelta(days=days - 1)

        return start_date, end_date

    def fetch_issues(self, start_date, end_date) -> list:
        """기간 내 이슈 조회"""
        # end_date + 1일을 사용하여 end_date 전체를 포함
        # JQL에서 '<=' 사용 시 해당 날짜 00:00:00까지만 포함됨
        from datetime import timedelta
        next_day = end_date + timedelta(days=1)

        jql = f"""
            assignee = "{self.assignee}"
            AND updated >= "{start_date}"
            AND updated < "{next_day}"
            ORDER BY updated DESC
        """.strip()

        return self.jira.search_issues(jql)

    def categorize_issues(self, issues: list) -> dict:
        """이슈를 유형별로 분류"""
        categories = defaultdict(list)

        status_map = {
            "완료": "completed",
            "Done": "completed",
            "Closed": "completed",
            "모니터링": "monitoring",
            "검수 완료": "review_done",
            "STAG 반영": "staging",
            "진행 중": "in_progress",
            "In Progress": "in_progress",
            "해야 할 일": "todo",
            "To Do": "todo",
            "Open": "todo",
        }

        type_map = {
            "버그": "bug",
            "Bug": "bug",
            "개선": "improvement",
            "Improvement": "improvement",
            "작업": "task",
            "Task": "task",
            "새 기능": "feature",
            "New Feature": "feature",
            "Story": "story",
            "스토리": "story",
        }

        for issue in issues:
            fields = issue.get("fields", {})
            status_name = fields.get("status", {}).get("name", "")
            issue_type = fields.get("issuetype", {}).get("name", "")

            status_key = status_map.get(status_name, "other")
            type_key = type_map.get(issue_type, "other")

            # 댓글 추출
            comments = fields.get("comment", {}).get("comments", [])
            extracted_comments = self._extract_comments(comments)

            issue_data = {
                "key": issue.get("key"),
                "summary": fields.get("summary", ""),
                "description": self._extract_description(fields.get("description")),
                "comments": extracted_comments,
                "status": status_name,
                "type": issue_type,
                "priority": fields.get("priority", {}).get("name", ""),
                "labels": fields.get("labels", []),
            }

            categories[f"{status_key}_{type_key}"].append(issue_data)
            categories[f"by_status_{status_key}"].append(issue_data)
            categories[f"by_type_{type_key}"].append(issue_data)
            categories["all"].append(issue_data)

        return categories

    def _extract_description(self, description) -> str:
        """Jira ADF 형식의 설명을 텍스트로 변환"""
        if not description:
            return ""

        if isinstance(description, str):
            return description

        # Atlassian Document Format (ADF) 처리
        def extract_text(node):
            if isinstance(node, str):
                return node
            if isinstance(node, dict):
                if node.get("type") == "text":
                    return node.get("text", "")
                content = node.get("content", [])
                return "".join(extract_text(c) for c in content)
            if isinstance(node, list):
                return "".join(extract_text(c) for c in node)
            return ""

        return extract_text(description).strip()[:500]  # 500자 제한

    def _extract_comments(self, comments: list) -> list:
        """Jira 댓글 목록에서 텍스트 추출"""
        extracted = []
        for comment in comments:
            body = comment.get("body")
            author = comment.get("author", {}).get("displayName", "Unknown")
            created = comment.get("created", "")

            # 날짜 파싱
            if created:
                try:
                    created_dt = date_parser.parse(created)
                    created_str = created_dt.strftime("%Y-%m-%d %H:%M")
                except:
                    created_str = created[:10] if len(created) >= 10 else created
            else:
                created_str = ""

            # ADF 형식 텍스트 추출
            text = self._extract_description(body)
            if text:
                extracted.append({
                    "author": author,
                    "created": created_str,
                    "text": text[:300]  # 댓글은 300자 제한
                })

        return extracted

    def _format_issues_with_details(self, issues: list) -> str:
        """이슈 목록을 상세 내용(설명 + 댓글)과 함께 포맷팅"""
        md = ""
        for issue in issues:
            md += f"#### {issue['key']}: {issue['summary']}\n\n"

            # 설명
            if issue['description']:
                md += f"**내용**: {issue['description']}\n\n"

            # 댓글
            if issue.get('comments'):
                md += "**진행 내역**:\n"
                for comment in issue['comments']:
                    md += f"- [{comment['created']}] {comment['text']}\n"
                md += "\n"

            md += "---\n\n"

        return md

    def generate_markdown(self, start_date, end_date, categories: dict) -> str:
        """마크다운 회고록 생성"""
        all_issues = categories.get("all", [])
        completed = categories.get("by_status_completed", [])
        monitoring = categories.get("by_status_monitoring", [])
        in_progress = categories.get("by_status_in_progress", [])
        todo = categories.get("by_status_todo", [])

        bugs = categories.get("by_type_bug", [])
        improvements = categories.get("by_type_improvement", [])
        features = categories.get("by_type_feature", [])
        tasks = categories.get("by_type_task", [])

        # 통계 계산
        total = len(all_issues)
        completed_count = len(completed) + len(monitoring)  # 모니터링도 완료로 간주

        md = f"""---
title: "주간 회고록 ({start_date.strftime('%Y.%m.%d')} ~ {end_date.strftime('%Y.%m.%d')})"
date: "{end_date.strftime('%Y-%m-%d')}"
tags: [회고, 모비닥, 주간회고]
---

## 개요

{start_date.strftime('%Y년 %m월')} {self._get_week_number(start_date)}주차 회고록입니다. 이번 주에는 총 {total}개의 이슈를 처리했습니다.

---

## 완료한 작업

"""

        # 완료된 작업 (버그, 개선, 새 기능, 작업 순서)
        completed_bugs = [i for i in bugs if i in completed or i in monitoring]
        completed_improvements = [i for i in improvements if i in completed or i in monitoring]
        completed_features = [i for i in features if i in completed or i in monitoring]
        completed_tasks = [i for i in tasks if i in completed or i in monitoring]

        if completed_bugs:
            md += "### 버그 수정\n\n"
            md += self._format_issues_with_details(completed_bugs)

        if completed_improvements:
            md += "### 기능 개선\n\n"
            md += self._format_issues_with_details(completed_improvements)

        if completed_features:
            md += "### 새 기능 개발\n\n"
            md += self._format_issues_with_details(completed_features)

        if completed_tasks:
            md += "### 작업\n\n"
            md += self._format_issues_with_details(completed_tasks)

        if not (completed_bugs or completed_improvements or completed_features or completed_tasks):
            md += "_완료된 작업이 없습니다._\n\n"

        # 진행 중인 작업
        md += "---\n\n## 진행 중인 작업\n\n"

        in_progress_all = in_progress + todo
        if in_progress_all:
            md += "| 제목 | 상태 | 유형 |\n|------|------|------|\n"
            for issue in in_progress_all:
                md += f"| {issue['summary']} | {issue['status']} | {issue['type']} |\n"
        else:
            md += "_진행 중인 작업이 없습니다._\n"

        # 주요 성과 및 인사이트
        md += f"""
---

## 주요 성과 및 인사이트

_이번 주 주요 성과와 인사이트를 작성해주세요._

---

## 다음 주 계획

_다음 주 계획을 작성해주세요._

---

## 통계

- **총 이슈 수**: {total}개
- **완료/모니터링**: {completed_count}개 ({(completed_count / total * 100) if total > 0 else 0:.0f}%)
- **진행 중**: {len(in_progress_all)}개 ({(len(in_progress_all) / total * 100) if total > 0 else 0:.0f}%)

### 유형별 분포

| 유형 | 개수 |
|------|------|
| 버그 | {len(bugs)}개 |
| 개선 | {len(improvements)}개 |
| 새 기능 | {len(features)}개 |
| 작업 | {len(tasks)}개 |
"""

        return md

    def _get_week_number(self, date) -> int:
        """해당 월의 몇째 주인지 계산"""
        first_day = date.replace(day=1)
        return (date.day + first_day.weekday()) // 7 + 1

    def save(self, start_date, end_date, content: str) -> str:
        """회고록 파일 저장"""
        filename = f"{start_date.strftime('%Y-%m-%d')}-{end_date.strftime('%Y-%m-%d')}-weekly-retrospective.md"
        filepath = self.output_dir / filename

        # 이미 존재하면 스킵
        if filepath.exists():
            print(f"File already exists: {filepath}")
            return str(filepath)

        # 디렉토리 생성
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # 파일 저장
        filepath.write_text(content, encoding="utf-8")
        print(f"Created: {filepath}")
        return str(filepath)

    def run(self, reference_date: datetime = None, days: int = 7) -> str:
        """회고록 생성 실행

        Args:
            reference_date: 기준 날짜 (기본값: 오늘)
            days: 조회할 일수 (기본값: 7일)
        """
        start_date, end_date = self.get_date_range(reference_date, days)
        print(f"Generating retrospective for {start_date} ~ {end_date}")

        issues = self.fetch_issues(start_date, end_date)
        print(f"Found {len(issues)} issues")

        categories = self.categorize_issues(issues)
        content = self.generate_markdown(start_date, end_date, categories)

        return self.save(start_date, end_date, content)


def main():
    # 환경 변수에서 설정 읽기
    base_url = os.environ.get("JIRA_BASE_URL", "flyingdoctor.atlassian.net")
    email = os.environ.get("JIRA_EMAIL")
    api_token = os.environ.get("JIRA_API_TOKEN")
    assignee = os.environ.get("JIRA_ASSIGNEE")

    if not all([email, api_token, assignee]):
        print("Error: Missing required environment variables")
        print("Required: JIRA_EMAIL, JIRA_API_TOKEN, JIRA_ASSIGNEE")
        sys.exit(1)

    # 출력 디렉토리 (스크립트 위치 기준)
    script_dir = Path(__file__).parent
    output_dir = script_dir.parent / "_pages" / "Retrospective"

    # 클라이언트 초기화
    jira = JiraClient(base_url, email, api_token)
    generator = RetrospectiveGenerator(jira, assignee, output_dir)

    # 회고록 생성
    try:
        filepath = generator.run()
        print(f"Successfully generated: {filepath}")
    except requests.exceptions.HTTPError as e:
        print(f"Jira API error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
