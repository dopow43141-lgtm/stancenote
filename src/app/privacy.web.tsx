export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, 'Hiragino Sans', sans-serif", background: "#f0f4f8", minHeight: "100vh", padding: "40px 16px" }}>
      <style>{`html, body { margin: 0; padding: 0; } * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", background: "#fff", borderRadius: 20, padding: "32px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#1a3a5c", letterSpacing: -1 }}>StanceNote</div>
          <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 3, marginTop: 2 }}>SNOWBOARD SETTINGS</div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>プライバシーポリシー / Privacy Policy</h1>
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 32 }}>最終更新日：2026年7月5日　Last updated: July 5, 2026</p>

        <Section title="1. はじめに / Introduction">
          <p>StanceNote（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、本アプリにおける情報の取り扱いについて説明するものです。</p>
          <p style={{ color: "#64748b" }}>StanceNote ("the App") respects your privacy and is committed to protecting your personal information. This policy explains how information is handled within the App.</p>
        </Section>

        <Section title="2. 収集する情報 / Information We Collect">
          <p>本アプリは、以下の情報を端末内にのみ保存します。外部サーバーへの送信は一切行いません。</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
            <li>スノーボードのセッティングデータ（スタンス幅、角度、板・バインディング情報等）</li>
            <li>ユーザーが添付した写真・動画</li>
            <li>レビュー、メモ、スキー場名等のテキスト情報</li>
          </ul>
          <p style={{ color: "#64748b" }}>The App stores the following information only on your device. No data is transmitted to external servers.</p>
          <ul style={{ paddingLeft: 20, margin: "8px 0", color: "#64748b" }}>
            <li>Snowboard setting data (stance width, angles, board/binding info, etc.)</li>
            <li>Photos and videos attached by the user</li>
            <li>Reviews, memos, resort names, and other text information</li>
          </ul>
        </Section>

        <Section title="3. データの保存 / Data Storage">
          <p>すべてのデータはユーザーの端末内に保存されます。クラウドへのバックアップや同期は行いません。アプリを削除すると、すべてのデータが失われます。</p>
          <p style={{ color: "#64748b" }}>All data is stored locally on your device. There is no cloud backup or synchronization. Deleting the App will permanently erase all data.</p>
        </Section>

        <Section title="4. 写真・動画へのアクセス / Photo & Video Access">
          <p>本アプリは、セッティング記録に写真や動画を添付する目的でのみ、端末の写真ライブラリへのアクセスを要求します。選択された写真・動画は端末内にのみ保存され、外部に送信されることはありません。</p>
          <p style={{ color: "#64748b" }}>The App requests access to your photo library solely for attaching photos and videos to setting records. Selected media is stored only on your device and is never transmitted externally.</p>
        </Section>

        <Section title="5. お問い合わせ情報 / Contact Information">
          <p>お問い合わせフォームを通じて提供されるメールアドレスおよびお問い合わせ内容は、回答の目的にのみ使用し、第三者への提供は行いません。</p>
          <p style={{ color: "#64748b" }}>Email addresses and inquiry details provided through the contact form are used solely for responding to your inquiry and are not shared with third parties.</p>
        </Section>

        <Section title="6. 第三者サービス / Third-Party Services">
          <p>本アプリは、分析ツールや広告サービスなどの第三者サービスを使用していません。</p>
          <p style={{ color: "#64748b" }}>The App does not use any third-party services such as analytics tools or advertising services.</p>
        </Section>

        <Section title="7. お子様のプライバシー / Children's Privacy">
          <p>本アプリは、13歳未満のお子様を対象としていません。13歳未満の方から意図的に個人情報を収集することはありません。</p>
          <p style={{ color: "#64748b" }}>The App is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
        </Section>

        <Section title="8. ポリシーの変更 / Changes to This Policy">
          <p>本ポリシーは、必要に応じて変更される場合があります。変更後のポリシーは、本アプリ内に掲示した時点で効力を生じます。</p>
          <p style={{ color: "#64748b" }}>This policy may be updated as needed. Changes take effect when posted within the App.</p>
        </Section>

        <Section title="9. お問い合わせ / Contact Us">
          <p>本ポリシーに関するお問い合わせは、以下のフォームよりご連絡ください。</p>
          <p><a href="https://docs.google.com/forms/d/1UcwurVEIchVdZlY9V_F9nA82ESWgY98G1_hImag6CHg/viewform" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>お問い合わせフォーム / Contact Form</a></p>
          <p style={{ color: "#64748b" }}>For questions about this policy, please use the contact form linked above.</p>
        </Section>

        <div style={{ textAlign: "center", marginTop: 40, paddingTop: 20, borderTop: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>© 2026 StanceNote</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8, borderLeft: "3px solid #2563eb", paddingLeft: 12 }}>{title}</h2>
      <div style={{ fontSize: 14, lineHeight: 1.8, color: "#334155" }}>{children}</div>
    </div>
  );
}
