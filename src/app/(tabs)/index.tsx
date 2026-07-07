import { useCallback, useState } from 'react';

import { AppHeader } from '@/components/stancenote/AppHeader';
import { SettingForm } from '@/components/stancenote/SettingForm';
import { ScreenScrollView } from '@/components/stancenote/ScreenScrollView';
import { ThemedText } from '@/components/themed-text';
import { useFocusEffect } from 'expo-router';
import { getBindings, getBoards } from '@/storage/boardsStorage';
import { addSettingRecord } from '@/storage/settingsStorage';
import { BindingProfile, BoardProfile } from '@/types/board';
import { t } from '@/i18n';

export default function RecordScreen() {
  const [boards, setBoards] = useState<BoardProfile[]>([]);
  const [bindings, setBindings] = useState<BindingProfile[]>([]);
  const [formKey, setFormKey] = useState(0);
  const [savedMessage, setSavedMessage] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getBoards().then(setBoards);
      getBindings().then(setBindings);
    }, [])
  );

  return (
    <ScreenScrollView>
      <AppHeader />
      {savedMessage && <ThemedText type="smallBold">{t('record.saved')}</ThemedText>}
      <SettingForm
        key={formKey}
        boards={boards}
        bindings={bindings}
        submitLabel={t('record.submit')}
        onSubmit={async (input) => {
          await addSettingRecord(input);
          setSavedMessage(true);
          setFormKey((key) => key + 1);
          setTimeout(() => setSavedMessage(false), 2000);
        }}
      />
    </ScreenScrollView>
  );
}
