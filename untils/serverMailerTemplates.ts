interface emailTemplate {
  subject: string;
  text: (code: string) => string;
  html: (code: string) => string;
}

interface emailTemplates {
  [language: string]: {
    [purpose: string]: emailTemplate;
  };
}

export const emailTemplates: emailTemplates = {
  TW: {
    verification: {
      subject: "請驗證您的信箱",
      text: (code: string) =>
        `您的驗證碼為：${code}\n如果您沒有請求此驗證，請忽略此郵件。`,
      html: (code: string) => `
        <p>您的驗證碼為：</p>
        <h2>${code}</h2>
        <p>如果您沒有請求此驗證，請忽略此郵件。</p>
      `,
    },
  },
};
