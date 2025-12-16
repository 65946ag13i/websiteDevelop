import nodemailer from "nodemailer";
import { emailTemplates } from "@/utils/serverMailerTemplates";

//驗證碼生成
function generateVerificationCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    const digit = Math.floor(Math.random() * 10); // 生成 0 到 9 的隨機數字
    code += digit;
    // console.log(`第 ${i + 1} 位數字: ${digit}`);
  }
  console.log(`最終驗證碼: ${code}`);
  return code;
}
//簡易驗證email
function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 郵件地址驗證正則表達式
  return emailRegex.test(email);
}

// 創建 Nodemailer 傳輸器

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_SENDER_EMAIL, // 你的 Gmail 地址
    clientId: process.env.GOOGLE_CLIENT_ID, //oauth2 account
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, //oauth2 secret
    refreshToken: process.env.GOOGLE_MAIL_Refresh, // OAuth 2.0 Playground
  },
});

interface EmailResult {
  success: boolean;
  message: string;
  VerificationCode?: string; // 驗證碼是可選的
}

// 選擇 語言 、 送出種類 、 信箱

export default async function sendEmailMiddleware(
  Language: string,
  purpose: string,
  useMail: string,
): Promise<EmailResult> {
  const languageTemplates = emailTemplates[Language];
  if (!languageTemplates) {
    return {
      success: false,
      message: `Email unsupported language: ${Language}`,
    };
  }
  const templates = languageTemplates[purpose];
  if (!templates) {
    return {
      success: false,
      message: `Email unsupported Template Selection: ${purpose}`,
    };
  }

  if (
    typeof useMail !== "string" ||
    useMail.split(",").length > 1 ||
    !isValidEmail(useMail)
  ) {
    return {
      success: false,
      message: `信箱驗證失敗`,
    };
  }
  const VerificationCode = generateVerificationCode();
  const mailOptions = {
    from: process.env.GOOGLE_SENDER_EMAIL, // 发件人
    to: useMail, // 收件人
    subject: templates.subject, // 主题
    text: templates.text(VerificationCode), // 纯文本内容
    html: templates.html(VerificationCode), // HTML 内容
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    if (result) {
      return { success: true, message: "驗證信已寄出", VerificationCode };
    } else {
      console.error(result);
      return { success: false, message: "驗證信寄出失敗" };
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error caught:", e.message);
      console.error(e);
      return {
        success: false,
        message: `驗證信寄出失敗`,
      };
    } else {
      console.error("Unknown error caught:", e);
      return {
        success: false,
        message: `驗證信寄出失敗`,
      };
    }
  }
}
