export default {
  // Tabs
  tabs: {
    record: '記録',
    history: '履歴',
    mypage: 'マイページ',
  },

  // Screen titles
  screens: {
    settingDetail: 'セッティング詳細',
    compare: '比較',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
  },

  // Record screen (index)
  record: {
    saved: '保存しました',
    submit: '記録する',
  },

  // Search & Sort
  search: {
    placeholder: 'タイトル・板・スキー場で検索',
    sortDate: '日付',
    sortStyle: 'スタイル',
    sortBoard: '板',
    sortResort: 'スキー場',
  },

  // History screen
  history: {
    title: '履歴',
    cancel: 'キャンセル',
    compare: '比較する',
    empty: 'まだセッティングが記録されていません。「記録」タブから追加しましょう。',
    compareSelected: '選択した2件を比較する',
  },

  // History detail
  detail: {
    loading: '読み込み中…',
    shareTitle: '【StanceNote】%{style}のセッティング',
    stanceWidth: 'スタンス幅：%{width}cm',
    angles: '前足角度：%{front}° / 後足角度：%{rear}°',
    memo: 'メモ：%{text}',
    deleteTitle: '削除しますか？',
    deleteMessage: 'この操作は取り消せません',
    deleteCancel: 'キャンセル',
    deleteConfirm: '削除する',
    update: '更新する',
    stance: 'スタンス',
    stanceWidthLabel: 'スタンス幅',
    frontAngle: '前足角度',
    rearAngle: '後足角度',
    setPosition: 'セット位置',
    setback: 'セットバック %{cm}cm',
    setfront: 'セットフロント %{cm}cm',
    center: 'センター',
    board: '板',
    binding: 'バインディング',
    resort: 'スキー場',
    snowCondition: '雪質',
    review: '出来',
    memoLabel: 'メモ',
    share: 'シェア',
    edit: '編集',
    delete: '削除',
  },

  // Compare screen
  compareScreen: {
    loading: '読み込み中…',
    title: 'セッティング比較',
    date: '日付',
    style: 'スタイル',
    stance: 'スタンス',
    stanceWidth: 'スタンス幅',
    frontAngle: '前足角度',
    rearAngle: '後足角度',
    setPosition: 'セット位置',
    board: '板',
    binding: 'バインディング',
    review: '出来',
  },

  // My Page
  mypage: {
    title: 'マイページ',
    myBoard: 'スノーボード',
    myBinding: 'バインディング',
    brand: 'ブランド',
    model: 'モデル',
    size: 'サイズ',
    addBoard: '板を追加',
    addBinding: 'バインディングを追加',
    support: 'サポート',
    terms: '利用規約',
    privacy: 'プライバシーポリシー',
    contact: 'お問合せ',
    about: 'アプリについて',
    delete: '削除',
  },

  // Setting Form
  form: {
    title: 'タイトル',
    titlePlaceholder: '例：パウダーデイ＠ニセコ',
    ridingStyle: 'ライディングスタイル',
    ridingStyleError: 'ライディングスタイルを選択してください',
    memoError: 'メモを入力してください',
    reviewLabel: 'レビュー',
    memoPlaceholder: '今日の感触・コメントなど',
    optional: '任意項目',
    board: '板',
    binding: 'バインディング',
    brand: 'ブランド',
    model: 'モデル',
    size: 'サイズ',
    media: '写真・動画',
    addMedia: '写真・動画を追加',
    ratingLabel: 'このセッティングの出来',
    resort: 'スキー場',
    resortPlaceholder: '例：キロロ',
    snowCondition: '雪質',
    snowPlaceholder: '例：パウダー',
    saving: '保存中…',
  },

  // Board Diagram
  diagram: {
    goofy: 'グーフィー',
    nose: 'ノーズ',
    frontFoot: '前足',
    rearFoot: '後足',
    instructions: 'バインディングは縦にドラッグでスタンス幅、中央のバーはセット位置を移動。右の円は指でなぞって角度を調整',
    instructionsButton: '＋/−ボタンで各数値を調整',
    modeDrag: 'ドラッグ',
    modeButton: 'ボタン',
    setback: 'セットバック',
    setfront: 'セットフロント',
    center: 'センター',
    stanceWidth: 'スタンス幅',
  },

  // Record Card
  card: {
    stance: 'スタンス',
    front: '前',
    rear: '後',
    noTitle: '無題',
  },

  // Riding styles
  ridingStyles: {
    freeride: 'フリーラン',
    carving: 'カービング',
    jump: 'ジャンプ',
    groundTrick: 'グラトリ',
    natural: 'ナチュラル',
    jib: 'ジブ',
  },

  // Stance types
  stanceTypes: {
    regular: 'レギュラー',
    goofy: 'グーフィー',
  },
} as const;
