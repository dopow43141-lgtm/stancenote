/**
 * StanceNote お問い合わせフォーム 自動応答スクリプト
 *
 * 設定手順:
 * 1. Google Forms → 「︙」メニュー → 「スクリプト エディタ」
 * 2. このコードを貼り付けて保存
 * 3. 左メニュー「トリガー」→「トリガーを追加」
 *    - 関数: onFormSubmit
 *    - イベントの種類: フォーム送信時
 * 4. 初回実行時にGmailへのアクセス許可を求められるので「許可」
 */

function onFormSubmit(e) {
  var responses = e.response.getItemResponses();

  var category = '';
  var email = '';
  var content = '';

  for (var i = 0; i < responses.length; i++) {
    var title = responses[i].getItem().getTitle();
    var answer = responses[i].getResponse();

    if (title === 'お問い合わせの種類') {
      category = answer;
    } else if (title === 'メールアドレス') {
      email = answer;
    } else if (title === 'お問い合わせ内容') {
      content = answer;
    }
  }

  if (!email) return;

  // ユーザーへの自動応答メール
  var userSubject = '【StanceNote】お問い合わせありがとうございます';
  var userBody =
    'この度はStanceNoteへお問い合わせいただき、\n' +
    'ありがとうございます。\n\n' +
    '以下の内容でお問い合わせを受け付けました。\n' +
    '確認後、担当者よりご連絡いたします。\n\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '■ お問い合わせの種類\n' + category + '\n\n' +
    '■ お問い合わせ内容\n' + content + '\n' +
    '━━━━━━━━━━━━━━━━━━━━\n\n' +
    '※ このメールは自動送信です。\n' +
    '  返信が必要な場合は数日以内にご連絡いたします。\n\n' +
    'StanceNote サポートチーム';

  GmailApp.sendEmail(email, userSubject, userBody, {
    name: 'StanceNote サポート'
  });

  // 管理者への通知メール
  var adminEmail = 'dopow43141@gmail.com';
  var adminSubject = '【StanceNote】新規お問い合わせ: ' + category;
  var adminBody =
    '新しいお問い合わせが届きました。\n\n' +
    '種類: ' + category + '\n' +
    'メール: ' + email + '\n' +
    '内容:\n' + content + '\n\n' +
    'フォーム回答: https://docs.google.com/forms/d/1UcwurVEIchVdZlY9V_F9nA82ESWgY98G1_hImag6CHg/edit#responses';

  GmailApp.sendEmail(adminEmail, adminSubject, adminBody, {
    name: 'StanceNote フォーム通知'
  });
}
