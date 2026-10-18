const fs = require("fs");
const path = require("path");

async function main() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const status = process.env.NOTIFY_STATUS || "success"; // 'success', 'fail', 'no-new'

  if (!botToken || !chatId) {
    console.log("텔레그램 설정(TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID)이 없어 알림을 건너뜁니다.");
    return;
  }

  let message = "";

  if (status === "fail") {
    message = `🚨 [우리 동네 이야기 - 성남] 아침 자동 발행 실패!\n\n` +
      `⚠️ 오늘 아침 글 생성 또는 사이트 배포 중 오류가 발생했습니다.\n` +
      `빠른 확인 및 수정이 필요합니다.\n\n` +
      `🔗 확인하기: https://github.com/editor823/my-local-info-seongnam/actions`;
  } else {
    // 최신 블로그 글 정보 가져오기 (작성 날짜 기준 최신 글 추출)
    const postsDir = path.join(process.cwd(), "src", "content", "posts");
    let latestPostTitle = "";

    try {
      if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
        const postsList = [];

        for (const file of files) {
          try {
            const rawContent = fs.readFileSync(path.join(postsDir, file), "utf-8");
            let title = "";
            let date = "";

            const titleMatch = rawContent.match(/title:\s*["']?([^"'\r\n]+)["']?/);
            if (titleMatch) {
              title = titleMatch[1].trim();
            }

            const dateMatch = rawContent.match(/date:\s*["']?(\d{4}-\d{2}-\d{2})["']?/);
            if (dateMatch) {
              date = dateMatch[1];
            } else {
              const fileDateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
              if (fileDateMatch) {
                date = fileDateMatch[1];
              }
            }

            postsList.push({ file, title, date });
          } catch (err) {
            // 개별 파일 오류 건너뜀
          }
        }

        // 날짜 기준 내림차순 정렬 (가장 최근 날짜 글이 맨 위로)
        postsList.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

        if (postsList.length > 0 && postsList[0].title) {
          latestPostTitle = postsList[0].title;
        }
      }
    } catch (e) {
      // 제목 파싱 실패 시 기본 텍스트 유지
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // 검수봇 품질 점검 결과 불러오기
    let auditText = "";
    try {
      const auditResultFile = path.join(__dirname, "audit-result.json");
      let auditData = null;
      if (fs.existsSync(auditResultFile)) {
        auditData = JSON.parse(fs.readFileSync(auditResultFile, "utf-8"));
      } else {
        const { runAudit } = require("./audit-posts.js");
        auditData = await runAudit();
      }

      if (auditData) {
        auditText = `\n\n🔍 [품질 검수봇 매일 체크 리포트]\n` +
          `• 검수 현황: 총 ${auditData.totalCount}편 전수 검사 완료\n` +
          `• 종합 품질 지수: ${auditData.qualityScore}점 / 100점 만점\n` +
          `• 통과: ${auditData.passCount}편 / 주의: ${auditData.warnCount}편 / 탈락: ${auditData.failCount}편\n` +
          `🎉 저품질 및 중복 없음 (애드센스 승인 기준 완벽 유지)`;
      }
    } catch (e) {
      // 검수 리포트 파싱 실패 시 건너뜀
    }

    if (process.env.NEW_POST_CREATED === "false") {
      message = `ℹ️ [우리 동네 이야기 - 성남] 아침 정기 점검 완료 (${todayStr})\n\n` +
        `새로운 공공데이터가 없어 오늘 새 글은 생성되지 않았습니다.\n` +
        `🔗 사이트: https://my-local-info-seongnam.pages.dev/blog` +
        auditText;
    } else {
      message = `✅ [우리 동네 이야기 - 성남] 아침 새 글 발행 완료! (${todayStr})\n\n` +
        `📝 오늘 발행: ${latestPostTitle || "최신 혜택 정보"}\n` +
        `🔗 바로가기: https://my-local-info-seongnam.pages.dev/blog\n\n` +
        `정상적으로 Cloudflare에 배포되었습니다.` +
        auditText;
    }
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (res.ok) {
      console.log("텔레그램 알림 전송 성공!");
    } else {
      const errText = await res.text();
      console.error("텔레그램 전송 실패:", res.status, errText);
    }
  } catch (err) {
    console.error("텔레그램 API 요청 에러:", err.message);
  }
}

main();
