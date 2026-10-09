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
    // 최신 블로그 글 정보 가져오기
    const postsDir = path.join(process.cwd(), "src", "content", "posts");
    let latestPostTitle = "";

    try {
      if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir)
          .filter((f) => f.endsWith(".md"))
          .sort()
          .reverse();

        if (files.length > 0) {
          const latestFile = files[0];
          const content = fs.readFileSync(path.join(postsDir, latestFile), "utf-8");
          const titleMatch = content.match(/title:\s*(.+)/);
          if (titleMatch) {
            latestPostTitle = titleMatch[1].replace(/["']/g, "").trim();
          }
        }
      }
    } catch (e) {
      // 제목 파싱 실패 시 기본 텍스트 유지
    }

    const todayStr = new Date().toISOString().split("T")[0];

    if (process.env.NEW_POST_CREATED === "false") {
      message = `ℹ️ [우리 동네 이야기 - 성남] 아침 점검 완료 (${todayStr})\n\n` +
        `새로운 공공데이터가 없어 오늘 새 글은 생성되지 않았습니다.\n` +
        `🔗 사이트: https://my-local-info-seongnam.pages.dev/blog`;
    } else {
      message = `✅ [우리 동네 이야기 - 성남] 아침 새 글 발행 완료! (${todayStr})\n\n` +
        `📝 제목: ${latestPostTitle || "최신 혜택 정보"}\n` +
        `🔗 바로가기: https://my-local-info-seongnam.pages.dev/blog\n\n` +
        `정상적으로 Cloudflare에 배포되었습니다.`;
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
