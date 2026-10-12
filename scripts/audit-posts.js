const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// 검수 기준 설정
const MIN_LENGTH_PASS = 2500; // 합격 최소 글자수 (공백 포함)
const MIN_LENGTH_WARN = 2000; // 주의 기준
const BANNED_AI_WORDS = ["안녕하세요!", "알아보겠습니다", "3가지 이유", "지금 바로 시작하겠습니다", "살펴보도록 하겠습니다"];
const IRRELEVANT_KEYWORDS = ["어업", "원양", "선박", "해양", "항만", "수협", "귀어"];

async function runAudit() {
  console.log("======================================================");
  console.log(" 🔍 [성남시 생활정보 포털] 블로그 게시글 품질 & 중복 종합 검수봇");
  console.log("======================================================\n");

  const postsDir = path.join(process.cwd(), "src", "content", "posts");

  if (!fs.existsSync(postsDir)) {
    console.error("❌ 포스트 폴더(src/content/posts)가 존재하지 않습니다.");
    return { success: false, totalCount: 0, issues: [] };
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    console.log("⚠️ 검수할 게시글이 없습니다.");
    return { success: true, totalCount: 0, issues: [] };
  }

  console.log(`📌 총 ${files.length}개의 게시글 검수를 시작합니다...\n`);

  const titles = new Map(); // 제목 중복 검사용
  const summaries = new Map(); // 요약 중복 검사용
  const results = [];
  let totalIssuesCount = 0;

  for (const filename of files) {
    const filePath = path.join(postsDir, filename);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(rawContent);

    const issues = [];
    const warnings = [];

    // 1. 글자 수 검사 (본문 순수 텍스트 기준)
    const charCountWithSpace = content.length;
    const charCountWithoutSpace = content.replace(/\s/g, "").length;

    if (charCountWithSpace < MIN_LENGTH_WARN) {
      issues.push(`분량 부족: 공백 포함 ${charCountWithSpace.toLocaleString()}자 (최소 ${MIN_LENGTH_PASS}자 권장)`);
    } else if (charCountWithSpace < MIN_LENGTH_PASS) {
      warnings.push(`분량 보통: 공백 포함 ${charCountWithSpace.toLocaleString()}자 (약간의 보강 권장)`);
    }

    // 2. 제목 중복 및 프론트매터 검사
    const title = (frontmatter.title || "").trim();
    if (!title) {
      issues.push("YAML 필수 항목 누락: 제목(title)이 없습니다.");
    } else {
      // 제목 유사도/중복 검사
      const normalizedTitle = title.replace(/\[.*?\]/g, "").replace(/\s+/g, "");
      if (titles.has(normalizedTitle)) {
        issues.push(`중복 의심: 기존 글 '${titles.get(normalizedTitle)}'과 제목이 거의 동일합니다.`);
      } else {
        titles.set(normalizedTitle, filename);
      }
    }

    if (!frontmatter.date) warnings.push("날짜(date)가 없습니다.");
    if (!frontmatter.summary) warnings.push("요약(summary)이 없습니다.");
    if (!frontmatter.category) warnings.push("카테고리(category)가 없습니다.");
    if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
      warnings.push("태그(tags)가 없습니다.");
    }

    // 3. AI 상투어 검사
    for (const banned of BANNED_AI_WORDS) {
      if (rawContent.includes(banned)) {
        issues.push(`AI 상투어 발견: '${banned}' 단어가 포함되어 있습니다.`);
      }
    }

    // 4. 성남시 무관 키워드 검사 (스팸 방지)
    for (const irrelevant of IRRELEVANT_KEYWORDS) {
      if (content.includes(irrelevant)) {
        issues.push(`부적절한 키워드 발견: 성남시와 무관한 '${irrelevant}' 단어가 포함되어 있습니다.`);
      }
    }

    // 5. 필수 고품질 구조 검사 (정규식 기반)
    const hasTable = /\|[\s]*:?-+:?[\s]*\|/.test(content) || content.includes("| ---") || content.includes("| :---");
    const hasTip = content.includes("꿀팁") || content.includes("노하우") || content.includes("주의사항") || content.includes("실전");
    const hasFAQ = content.includes("Q.") || content.includes("Q1") || content.includes("자주 묻는 질문") || content.includes("FAQ");
    const hasContact = content.includes("문의") || content.includes("콜센터") || content.includes("전화번호") || content.includes("1577-3100") || content.includes("031-");

    if (!hasTable) warnings.push("비교 표(Table)가 누락되었습니다.");
    if (!hasTip) warnings.push("에디터 실전 꿀팁 섹션이 누락되었습니다.");
    if (!hasFAQ) warnings.push("자주 묻는 질문(FAQ) 섹션이 누락되었습니다.");
    if (!hasContact) warnings.push("공식 문의처 안내가 누락되었습니다.");

    // 종합 상태 판정
    let status = "PASS"; // 통과
    if (issues.length > 0) {
      status = "FAIL"; // 불합격 (저품질/중복)
      totalIssuesCount += issues.length;
    } else if (warnings.length > 0) {
      status = "WARN"; // 주의 (약간 보완 필요)
    }

    results.push({
      filename,
      title: title || filename,
      charCount: charCountWithSpace,
      status,
      issues,
      warnings,
    });
  }

  // 검수 결과 상세 출력
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  console.log("┌────────────────────────────────────────────────────────────────────────────────────────┐");
  console.log("│ 상태   │ 글자 수(자) │ 파일명 및 제목                                                │");
  console.log("├────────────────────────────────────────────────────────────────────────────────────────┤");

  for (const item of results) {
    let icon = "✅ 통과";
    if (item.status === "FAIL") {
      icon = "❌ 탈락";
      failCount++;
    } else if (item.status === "WARN") {
      icon = "⚠️ 주의";
      warnCount++;
    } else {
      passCount++;
    }

    const lengthStr = `${item.charCount.toLocaleString()}자`.padStart(9, " ");
    const displayTitle = item.title.length > 35 ? item.title.slice(0, 32) + "..." : item.title;
    console.log(`│ ${icon} │ ${lengthStr} │ ${displayTitle.padEnd(46, " ")} │`);

    if (item.issues.length > 0) {
      item.issues.forEach((iss) => console.log(`│        │             │   🔴 [문제] ${iss}`));
    }
    if (item.warnings.length > 0) {
      item.warnings.forEach((warn) => console.log(`│        │             │   🟡 [권장] ${warn}`));
    }
  }

  console.log("└────────────────────────────────────────────────────────────────────────────────────────┘\n");

  // 최종 점수 및 통계
  const qualityScore = Math.max(0, Math.round(((passCount * 1.0 + warnCount * 0.7) / files.length) * 100));

  console.log("======================================================");
  console.log(` 📊 최종 검수 종합 결과 보고서`);
  console.log("======================================================");
  console.log(` • 총 검수 게시글 수: ${files.length}편`);
  console.log(` • 완벽 통과 (PASS) : ${passCount}편`);
  console.log(` • 권장 보완 (WARN) : ${warnCount}편`);
  console.log(` • 불합격 탈락 (FAIL) : ${failCount}편`);
  console.log(` • 종합 품질 지수   : ${qualityScore}점 / 100점 만점`);
  console.log("======================================================\n");

  if (failCount === 0) {
    console.log("🎉 [검수 완료] 저품질 및 중복 글이 전혀 없습니다! 구글 애드센스 승인 기준에 완벽히 부합합니다.\n");
  } else {
    console.log(`🚨 [조치 필요] 총 ${failCount}개의 게시글에서 심각한 저품질/중복 문제가 발견되었습니다. 상단 내역을 확인해 주세요.\n`);
  }

  const auditSummary = {
    success: failCount === 0,
    qualityScore,
    totalCount: files.length,
    passCount,
    warnCount,
    failCount,
  };

  try {
    fs.writeFileSync(path.join(__dirname, "audit-result.json"), JSON.stringify(auditSummary, null, 2));
  } catch (err) {
    // ignore
  }

  return auditSummary;
}

// 스크립트 단독 실행 시
if (require.main === module) {
  runAudit().then((res) => {
    if (!res.success) {
      process.exit(1);
    }
  });
}

module.exports = { runAudit };
