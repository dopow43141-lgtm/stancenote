export default {
  // Tabs
  tabs: {
    record: 'Record',
    history: 'History',
    mypage: 'My Page',
  },

  // Screen titles
  screens: {
    settingDetail: 'Setting Detail',
    compare: 'Compare',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
  },

  // Record screen (index)
  record: {
    saved: 'Saved',
    submit: 'Save Record',
  },

  // Search & Sort
  search: {
    placeholder: 'Search by title, board, resort',
    sortDate: 'Date',
    sortStyle: 'Style',
    sortBoard: 'Board',
    sortResort: 'Resort',
  },

  // History screen
  history: {
    title: 'History',
    cancel: 'Cancel',
    compare: 'Compare',
    empty: 'No settings recorded yet. Add one from the "Record" tab.',
    compareSelected: 'Compare 2 selected',
  },

  // History detail
  detail: {
    loading: 'Loading…',
    shareTitle: '[StanceNote] %{style} setup',
    stanceWidth: 'Stance width: %{width}cm',
    angles: 'Front angle: %{front}° / Rear angle: %{rear}°',
    memo: 'Memo: %{text}',
    deleteTitle: 'Delete this record?',
    deleteMessage: 'This action cannot be undone',
    deleteCancel: 'Cancel',
    deleteConfirm: 'Delete',
    update: 'Update',
    stance: 'Stance',
    stanceWidthLabel: 'Stance Width',
    frontAngle: 'Front Angle',
    rearAngle: 'Rear Angle',
    setPosition: 'Set Position',
    setback: 'Setback %{cm}cm',
    setfront: 'Set Forward %{cm}cm',
    center: 'Center',
    board: 'Board',
    binding: 'Binding',
    resort: 'Resort',
    snowCondition: 'Snow',
    review: 'Rating',
    memoLabel: 'Memo',
    share: 'Share',
    edit: 'Edit',
    delete: 'Delete',
  },

  // Compare screen
  compareScreen: {
    loading: 'Loading…',
    title: 'Compare Settings',
    date: 'Date',
    style: 'Style',
    stance: 'Stance',
    stanceWidth: 'Stance Width',
    frontAngle: 'Front Angle',
    rearAngle: 'Rear Angle',
    setPosition: 'Set Position',
    board: 'Board',
    binding: 'Binding',
    review: 'Rating',
  },

  // My Page
  mypage: {
    title: 'My Page',
    myBoard: 'My Boards',
    myBinding: 'My Bindings',
    brand: 'Brand',
    model: 'Model',
    size: 'Size',
    addBoard: 'Add Board',
    addBinding: 'Add Binding',
    support: 'Support',
    terms: 'Terms of Use',
    privacy: 'Privacy Policy',
    contact: 'Contact',
    about: 'About',
    delete: 'Delete',
  },

  // Setting Form
  form: {
    title: 'Title',
    titlePlaceholder: 'e.g. Powder day @ Whistler',
    ridingStyle: 'Riding Style',
    ridingStyleError: 'Please select a riding style',
    memoError: 'Please enter a memo',
    reviewLabel: 'Review',
    memoPlaceholder: "Today's feel, comments, etc.",
    optional: 'Optional',
    board: 'Board',
    binding: 'Binding',
    brand: 'Brand',
    model: 'Model',
    size: 'Size',
    media: 'Photos & Videos',
    addMedia: 'Add Photos & Videos',
    ratingLabel: 'Rate this setup',
    resort: 'Resort',
    resortPlaceholder: 'e.g. Whistler',
    snowCondition: 'Snow Condition',
    snowPlaceholder: 'e.g. Powder',
    saving: 'Saving…',
  },

  // Board Diagram
  diagram: {
    goofy: 'Goofy',
    nose: 'Nose',
    frontFoot: 'Front',
    rearFoot: 'Rear',
    instructions: 'Drag bindings vertically to adjust stance width. Drag the center bar to change set position. Trace the circles to adjust angles.',
    instructionsButton: 'Use +/− buttons to adjust values',
    modeDrag: 'Drag',
    modeButton: 'Button',
    setback: 'Setback',
    setfront: 'Set Forward',
    center: 'Center',
    stanceWidth: 'Stance Width',
  },

  // Record Card
  card: {
    stance: 'Stance',
    front: 'F',
    rear: 'R',
    noTitle: 'Untitled',
  },

  // Riding styles
  ridingStyles: {
    freeride: 'Freeride',
    carving: 'Carving',
    jump: 'Jump',
    groundTrick: 'Ground Trick',
    natural: 'Natural',
    jib: 'Jib',
  },

  // Stance types
  stanceTypes: {
    regular: 'Regular',
    goofy: 'Goofy',
  },
} as const;
