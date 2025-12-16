interface emailTemplate {
  subject: string;
  // eslint-disable-next-line no-unused-vars
  text: (code: string) => string;
  // eslint-disable-next-line no-unused-vars
  html: (code: string) => string;
}

interface EmailTemplates {
  [language: string]: {
    [purpose: string]: emailTemplate;
  };
}

export const emailTemplates: EmailTemplates = {
  TW: {
    verification: {
      subject: '請驗證您的信箱',
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
