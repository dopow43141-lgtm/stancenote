import { StyleSheet, View } from 'react-native';

import { ScreenScrollView } from '@/components/stancenote/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export default function TermsScreen() {
  return (
    <ScreenScrollView includeTabBarInset={false}>
      <ThemedText type="subtitle">利用規約</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        最終更新日：2026年7月4日
      </ThemedText>

      <Section title="第1条（適用）">
        本利用規約（以下「本規約」）は、StanceNote（以下「本アプリ」）の利用に関する条件を定めるものです。ユーザーは本アプリを利用することにより、本規約に同意したものとみなします。
      </Section>

      <Section title="第2条（サービス内容）">
        本アプリは、スノーボードのセッティング（スタンス幅、バインディング角度、板情報等）を記録・管理・比較するためのツールです。記録データはユーザーの端末内に保存されます。
      </Section>

      <Section title="第3条（利用料金）">
        本アプリの基本機能は無料でご利用いただけます。将来的に有料プランを提供する場合は、事前に内容・料金を明示し、ユーザーの同意を得た上で課金を行います。
      </Section>

      <Section title="第4条（禁止事項）">
        ユーザーは、以下の行為を行ってはなりません。{'\n'}
        ・本アプリの不正利用またはリバースエンジニアリング{'\n'}
        ・他のユーザーまたは第三者の権利を侵害する行為{'\n'}
        ・法令または公序良俗に反する行為{'\n'}
        ・本アプリの運営を妨害する行為
      </Section>

      <Section title="第5条（免責事項）">
        本アプリに記録されたデータの正確性、完全性について、運営者は保証いたしません。端末の故障、アプリの削除等によるデータの消失について、運営者は一切の責任を負いません。本アプリの利用に基づくスノーボードの設定・調整は、ユーザー自身の判断と責任のもと行ってください。
      </Section>

      <Section title="第6条（個人情報の取り扱い）">
        本アプリは、記録データを端末内にのみ保存し、外部サーバーへの送信は行いません。お問合せ時にユーザーが任意で提供する情報（メールアドレス等）は、回答目的にのみ使用し、第三者への提供は行いません。
      </Section>

      <Section title="第7条（規約の変更）">
        運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本アプリ内に掲示した時点で効力を生じるものとします。
      </Section>

      <Section title="第8条（準拠法・管轄）">
        本規約は日本法に準拠し、本規約に関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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
