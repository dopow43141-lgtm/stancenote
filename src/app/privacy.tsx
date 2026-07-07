import { StyleSheet, View } from 'react-native';

import { ScreenScrollView } from '@/components/stancenote/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <ScreenScrollView includeTabBarInset={false}>
      <ThemedText type="subtitle">プライバシーポリシー</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Privacy Policy
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        最終更新日 / Last updated: 2026-07-05
      </ThemedText>

      <Section title="1. はじめに / Introduction">
        StanceNote（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本ポリシーは、本アプリにおける情報の取り扱いについて説明するものです。
        {'\n\n'}
        StanceNote ("the App") respects your privacy and is committed to protecting your personal information. This policy explains how information is handled within the App.
      </Section>

      <Section title="2. 収集する情報 / Information We Collect">
        本アプリは、以下の情報を端末内にのみ保存します。外部サーバーへの送信は一切行いません。
        {'\n'}・スノーボードのセッティングデータ（スタンス幅、角度、板・バインディング情報等）
        {'\n'}・ユーザーが添付した写真・動画
        {'\n'}・レビュー、メモ、スキー場名等のテキスト情報
        {'\n\n'}
        The App stores the following information only on your device. No data is transmitted to external servers.
        {'\n'}• Snowboard setting data (stance width, angles, board/binding info, etc.)
        {'\n'}• Photos and videos attached by the user
        {'\n'}• Reviews, memos, resort names, and other text information
      </Section>

      <Section title="3. データの保存 / Data Storage">
        すべてのデータはユーザーの端末内に保存されます。クラウドへのバックアップや同期は行いません。アプリを削除すると、すべてのデータが失われます。
        {'\n\n'}
        All data is stored locally on your device. There is no cloud backup or synchronization. Deleting the App will permanently erase all data.
      </Section>

      <Section title="4. 写真・動画へのアクセス / Photo & Video Access">
        本アプリは、セッティング記録に写真や動画を添付する目的でのみ、端末の写真ライブラリへのアクセスを要求します。選択された写真・動画は端末内にのみ保存され、外部に送信されることはありません。
        {'\n\n'}
        The App requests access to your photo library solely for attaching photos and videos to setting records. Selected media is stored only on your device and is never transmitted externally.
      </Section>

      <Section title="5. お問い合わせ情報 / Contact Information">
        お問い合わせフォームを通じて提供されるメールアドレスおよびお問い合わせ内容は、回答の目的にのみ使用し、第三者への提供は行いません。
        {'\n\n'}
        Email addresses and inquiry details provided through the contact form are used solely for responding to your inquiry and are not shared with third parties.
      </Section>

      <Section title="6. 第三者サービス / Third-Party Services">
        本アプリは、分析ツールや広告サービスなどの第三者サービスを使用していません。
        {'\n\n'}
        The App does not use any third-party services such as analytics tools or advertising services.
      </Section>

      <Section title="7. お子様のプライバシー / Children's Privacy">
        本アプリは、13歳未満のお子様を対象としていません。13歳未満の方から意図的に個人情報を収集することはありません。
        {'\n\n'}
        The App is not intended for children under 13. We do not knowingly collect personal information from children under 13.
      </Section>

      <Section title="8. ポリシーの変更 / Changes to This Policy">
        本ポリシーは、必要に応じて変更される場合があります。変更後のポリシーは、本アプリ内に掲示した時点で効力を生じます。
        {'\n\n'}
        This policy may be updated as needed. Changes take effect when posted within the App.
      </Section>

      <Section title="9. お問い合わせ / Contact Us">
        本ポリシーに関するお問い合わせは、アプリ内のお問い合わせフォームよりご連絡ください。
        {'\n\n'}
        For questions about this policy, please contact us through the in-app contact form.
      </Section>
    </ScreenScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold">{title}</ThemedText>
      <ThemedText type="small">{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.one,
  },
});
