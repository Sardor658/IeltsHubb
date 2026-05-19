import { useState } from 'react';
import { Play, ArrowLeft, BookOpen, ChevronRight, Volume2, RotateCcw, Check, X } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import './Vocabulary.css';

// ===================== WORD DATA =====================
const deckData = [
  {
    id: 'beginner',
    level: 'beginner',
    title: 'Beginner',
    color: '#6c63ff',
    isCurrent: true,
    topics: [
      {
        id: 'animals',
        title: 'Animals',
        units: 3,
        words: [
          { en: 'Dog', uz: 'It', ru: 'Собака' },
          { en: 'Cat', uz: 'Mushuk', ru: 'Кошка' },
          { en: 'Bird', uz: 'Qush', ru: 'Птица' },
          { en: 'Fish', uz: 'Baliq', ru: 'Рыба' },
          { en: 'Horse', uz: 'Ot', ru: 'Лошадь' },
          { en: 'Cow', uz: 'Sigir', ru: 'Корова' },
          { en: 'Sheep', uz: 'Qo\'y', ru: 'Овца' },
          { en: 'Rabbit', uz: 'Quyon', ru: 'Кролик' },
          { en: 'Tiger', uz: 'Yo\'lbars', ru: 'Тигр' },
          { en: 'Lion', uz: 'Sher', ru: 'Лев' },
          { en: 'Elephant', uz: 'Fil', ru: 'Слон' },
          { en: 'Monkey', uz: 'Maymun', ru: 'Обезьяна' },
          { en: 'Snake', uz: 'Ilon', ru: 'Змея' },
          { en: 'Frog', uz: 'Qurbaqa', ru: 'Лягушка' },
          { en: 'Bear', uz: 'Ayiq', ru: 'Медведь' },
        ],
      },
      {
        id: 'food',
        title: 'Food & Drink',
        units: 3,
        words: [
          { en: 'Bread', uz: 'Non', ru: 'Хлеб' },
          { en: 'Water', uz: 'Suv', ru: 'Вода' },
          { en: 'Milk', uz: 'Sut', ru: 'Молоко' },
          { en: 'Egg', uz: 'Tuxum', ru: 'Яйцо' },
          { en: 'Rice', uz: 'Guruch', ru: 'Рис' },
          { en: 'Meat', uz: 'Go\'sht', ru: 'Мясо' },
          { en: 'Apple', uz: 'Olma', ru: 'Яблоко' },
          { en: 'Banana', uz: 'Banan', ru: 'Банан' },
          { en: 'Tea', uz: 'Choy', ru: 'Чай' },
          { en: 'Juice', uz: 'Sharbat', ru: 'Сок' },
          { en: 'Soup', uz: 'Sho\'rva', ru: 'Суп' },
          { en: 'Cheese', uz: 'Pishloq', ru: 'Сыр' },
          { en: 'Sugar', uz: 'Shakar', ru: 'Сахар' },
          { en: 'Salt', uz: 'Tuz', ru: 'Соль' },
          { en: 'Butter', uz: 'Sariyog\'', ru: 'Масло' },
        ],
      },
      {
        id: 'family',
        title: 'Family',
        units: 2,
        words: [
          { en: 'Mother', uz: 'Ona', ru: 'Мама' },
          { en: 'Father', uz: 'Ota', ru: 'Папа' },
          { en: 'Sister', uz: 'Singil', ru: 'Сестра' },
          { en: 'Brother', uz: 'Aka/Uka', ru: 'Брат' },
          { en: 'Grandmother', uz: 'Buvi', ru: 'Бабушка' },
          { en: 'Grandfather', uz: 'Bobo', ru: 'Дедушка' },
          { en: 'Son', uz: 'O\'g\'il', ru: 'Сын' },
          { en: 'Daughter', uz: 'Qiz', ru: 'Дочь' },
          { en: 'Uncle', uz: 'Amaki/Tog\'a', ru: 'Дядя' },
          { en: 'Aunt', uz: 'Xola/Amaki', ru: 'Тётя' },
          { en: 'Cousin', uz: 'Ama/Xola bolasi', ru: 'Двоюродный' },
          { en: 'Husband', uz: 'Er', ru: 'Муж' },
          { en: 'Wife', uz: 'Xotin', ru: 'Жена' },
          { en: 'Baby', uz: 'Chaqaloq', ru: 'Ребёнок' },
          { en: 'Family', uz: 'Oila', ru: 'Семья' },
        ],
      },
    ],
  },
  {
    id: 'elementary',
    level: 'elementary',
    title: 'Elementary',
    color: '#10b981',
    isCurrent: false,
    topics: [
      {
        id: 'colors',
        title: 'Colors',
        units: 2,
        words: [
          { en: 'Red', uz: 'Qizil', ru: 'Красный' },
          { en: 'Blue', uz: 'Ko\'k', ru: 'Синий' },
          { en: 'Green', uz: 'Yashil', ru: 'Зелёный' },
          { en: 'Yellow', uz: 'Sariq', ru: 'Жёлтый' },
          { en: 'Black', uz: 'Qora', ru: 'Чёрный' },
          { en: 'White', uz: 'Oq', ru: 'Белый' },
          { en: 'Orange', uz: 'To\'q sariq', ru: 'Оранжевый' },
          { en: 'Purple', uz: 'Binafsha', ru: 'Фиолетовый' },
          { en: 'Pink', uz: 'Pushti', ru: 'Розовый' },
          { en: 'Brown', uz: 'Jigarrang', ru: 'Коричневый' },
          { en: 'Grey', uz: 'Kulrang', ru: 'Серый' },
          { en: 'Gold', uz: 'Oltin rang', ru: 'Золотой' },
          { en: 'Silver', uz: 'Kumush rang', ru: 'Серебряный' },
          { en: 'Beige', uz: 'Krем rang', ru: 'Бежевый' },
          { en: 'Turquoise', uz: 'Firuza', ru: 'Бирюзовый' },
        ],
      },
      {
        id: 'body',
        title: 'Body Parts',
        units: 2,
        words: [
          { en: 'Head', uz: 'Bosh', ru: 'Голова' },
          { en: 'Eye', uz: 'Ko\'z', ru: 'Глаз' },
          { en: 'Ear', uz: 'Quloq', ru: 'Ухо' },
          { en: 'Nose', uz: 'Burun', ru: 'Нос' },
          { en: 'Mouth', uz: 'Og\'iz', ru: 'Рот' },
          { en: 'Hand', uz: 'Qo\'l', ru: 'Рука' },
          { en: 'Foot', uz: 'Oyoq', ru: 'Нога' },
          { en: 'Heart', uz: 'Yurak', ru: 'Сердце' },
          { en: 'Back', uz: 'Orqa', ru: 'Спина' },
          { en: 'Shoulder', uz: 'Yelka', ru: 'Плечо' },
          { en: 'Knee', uz: 'Tizza', ru: 'Колено' },
          { en: 'Finger', uz: 'Barmoq', ru: 'Палец' },
          { en: 'Stomach', uz: 'Qorin', ru: 'Живот' },
          { en: 'Chest', uz: 'Ko\'krak', ru: 'Грудь' },
          { en: 'Neck', uz: 'Bo\'yin', ru: 'Шея' },
        ],
      },
      {
        id: 'home',
        title: 'Home & Objects',
        units: 3,
        words: [
          { en: 'House', uz: 'Uy', ru: 'Дом' },
          { en: 'Door', uz: 'Eshik', ru: 'Дверь' },
          { en: 'Window', uz: 'Deraza', ru: 'Окно' },
          { en: 'Chair', uz: 'Stul', ru: 'Стул' },
          { en: 'Table', uz: 'Stol', ru: 'Стол' },
          { en: 'Bed', uz: 'Karavot', ru: 'Кровать' },
          { en: 'Lamp', uz: 'Chiroq', ru: 'Лампа' },
          { en: 'Kitchen', uz: 'Oshxona', ru: 'Кухня' },
          { en: 'Bathroom', uz: 'Hammom', ru: 'Ванная' },
          { en: 'Mirror', uz: 'Ko\'zgu', ru: 'Зеркало' },
          { en: 'Sofa', uz: 'Divan', ru: 'Диван' },
          { en: 'Carpet', uz: 'Gilam', ru: 'Ковёр' },
          { en: 'Curtain', uz: 'Parda', ru: 'Занавес' },
          { en: 'Shelf', uz: 'Javon', ru: 'Полка' },
          { en: 'Clock', uz: 'Soat', ru: 'Часы' },
        ],
      },
    ],
  },
  {
    id: 'intermediate',
    level: 'intermediate',
    title: 'Intermediate',
    color: '#f59e0b',
    isCurrent: false,
    topics: [
      {
        id: 'dailyactions',
        title: 'Daily Actions',
        units: 3,
        words: [
          { en: 'Wake up', uz: 'Uyg\'onmoq', ru: 'Просыпаться' },
          { en: 'Sleep', uz: 'Uxlamoq', ru: 'Спать' },
          { en: 'Eat', uz: 'Yemoq', ru: 'Есть' },
          { en: 'Drink', uz: 'Ichmoq', ru: 'Пить' },
          { en: 'Walk', uz: 'Yurmoq', ru: 'Ходить' },
          { en: 'Run', uz: 'Yugurmoq', ru: 'Бегать' },
          { en: 'Study', uz: 'O\'qimoq', ru: 'Учиться' },
          { en: 'Work', uz: 'Ishlаmoq', ru: 'Работать' },
          { en: 'Cook', uz: 'Pishirmoq', ru: 'Готовить' },
          { en: 'Clean', uz: 'Tozalamoq', ru: 'Убирать' },
          { en: 'Travel', uz: 'Sayohat qilmoq', ru: 'Путешествовать' },
          { en: 'Read', uz: 'O\'qimoq', ru: 'Читать' },
          { en: 'Write', uz: 'Yozmoq', ru: 'Писать' },
          { en: 'Listen', uz: 'Eshitmoq', ru: 'Слушать' },
          { en: 'Speak', uz: 'Gapirmoq', ru: 'Говорить' },
        ],
      },
      {
        id: 'nature',
        title: 'Nature',
        units: 3,
        words: [
          { en: 'Mountain', uz: 'Tog\'', ru: 'Гора' },
          { en: 'River', uz: 'Daryo', ru: 'Река' },
          { en: 'Sea', uz: 'Dengiz', ru: 'Море' },
          { en: 'Forest', uz: 'O\'rmon', ru: 'Лес' },
          { en: 'Desert', uz: 'Sahro', ru: 'Пустыня' },
          { en: 'Sky', uz: 'Osmon', ru: 'Небо' },
          { en: 'Sun', uz: 'Quyosh', ru: 'Солнце' },
          { en: 'Moon', uz: 'Oy', ru: 'Луна' },
          { en: 'Star', uz: 'Yulduz', ru: 'Звезда' },
          { en: 'Rain', uz: 'Yomg\'ir', ru: 'Дождь' },
          { en: 'Snow', uz: 'Qor', ru: 'Снег' },
          { en: 'Wind', uz: 'Shamol', ru: 'Ветер' },
          { en: 'Cloud', uz: 'Bulut', ru: 'Облако' },
          { en: 'Flower', uz: 'Gul', ru: 'Цветок' },
          { en: 'Tree', uz: 'Daraxt', ru: 'Дерево' },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    level: 'advanced',
    title: 'Advanced',
    color: '#ef4444',
    isCurrent: false,
    topics: [
      {
        id: 'academic',
        title: 'Academic Words',
        units: 3,
        words: [
          { en: 'Analyze', uz: 'Tahlil qilmoq', ru: 'Анализировать' },
          { en: 'Evaluate', uz: 'Baholamoq', ru: 'Оценивать' },
          { en: 'Significant', uz: 'Muhim', ru: 'Значительный' },
          { en: 'Approach', uz: 'Yondashuv', ru: 'Подход' },
          { en: 'Concept', uz: 'Tushuncha', ru: 'Концепция' },
          { en: 'Evidence', uz: 'Dalil', ru: 'Доказательство' },
          { en: 'Research', uz: 'Tadqiqot', ru: 'Исследование' },
          { en: 'Impact', uz: 'Ta\'sir', ru: 'Воздействие' },
          { en: 'Theory', uz: 'Nazariya', ru: 'Теория' },
          { en: 'Hypothesis', uz: 'Faraz', ru: 'Гипотеза' },
          { en: 'Conclusion', uz: 'Xulosa', ru: 'Заключение' },
          { en: 'Controversy', uz: 'Bahs-munozara', ru: 'Спор' },
          { en: 'Perspective', uz: 'Nuqtai nazar', ru: 'Перспектива' },
          { en: 'Implications', uz: 'Oqibatlar', ru: 'Последствия' },
          { en: 'Phenomenon', uz: 'Hodisa', ru: 'Феномен' },
        ],
      },
      {
        id: 'ielts',
        title: 'IELTS Topics',
        units: 3,
        words: [
          { en: 'Environment', uz: 'Atrof-muhit', ru: 'Окружающая среда' },
          { en: 'Globalization', uz: 'Globallashuv', ru: 'Глобализация' },
          { en: 'Technology', uz: 'Texnologiya', ru: 'Технология' },
          { en: 'Education', uz: 'Ta\'lim', ru: 'Образование' },
          { en: 'Health', uz: 'Sog\'liq', ru: 'Здоровье' },
          { en: 'Economy', uz: 'Iqtisodiyot', ru: 'Экономика' },
          { en: 'Migration', uz: 'Ko\'chish', ru: 'Миграция' },
          { en: 'Urbanization', uz: 'Shaharlashuv', ru: 'Урбанизация' },
          { en: 'Pollution', uz: 'Ifloslanish', ru: 'Загрязнение' },
          { en: 'Renewable', uz: 'Qayta tiklanadigan', ru: 'Возобновляемый' },
          { en: 'Sustainable', uz: 'Barqaror', ru: 'Устойчивый' },
          { en: 'Inequality', uz: 'Tengsizlik', ru: 'Неравенство' },
          { en: 'Innovation', uz: 'Yangilik', ru: 'Инновация' },
          { en: 'Automation', uz: 'Avtomatlashtirish', ru: 'Автоматизация' },
          { en: 'Biodiversity', uz: 'Biologik xilma-xillik', ru: 'Биоразнообразие' },
        ],
      },
    ],
  },
];

// ===================== COMPONENTS =====================

// Flashcard practice view
const PracticeView = ({ topic, onBack }) => {
  const lang = localStorage.getItem('ielts_lang') || 'UZ';
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);

  const word = topic.words[cardIndex];
  const total = topic.words.length;

  const handleKnow = () => {
    setKnown(prev => [...prev, cardIndex]);
    if (cardIndex + 1 >= total) setDone(true);
    else { setCardIndex(prev => prev + 1); setFlipped(false); }
  };

  const handleDontKnow = () => {
    setUnknown(prev => [...prev, cardIndex]);
    if (cardIndex + 1 >= total) setDone(true);
    else { setCardIndex(prev => prev + 1); setFlipped(false); }
  };

  const handleRestart = () => {
    setCardIndex(0); setFlipped(false); setKnown([]); setUnknown([]); setDone(false);
  };

  const getNative = (w) => {
    if (lang === 'RU') return w.ru;
    return w.uz;
  };

  if (done) {
    return (
      <div className="vocab-practice-container">
        <button className="vocab-back-btn" onClick={onBack}><ArrowLeft size={18} /> Orqaga</button>
        <div className="vocab-done-card">
          <div className="done-emoji">🎉</div>
          <h2>Barakalla!</h2>
          <p>{total} ta so'z tugadi</p>
          <div className="done-stats">
            <div className="done-stat known"><Check size={16}/> Bildim: {known.length}</div>
            <div className="done-stat unknown"><X size={16}/> Bilmadim: {unknown.length}</div>
          </div>
          <button className="vocab-restart-btn" onClick={handleRestart}><RotateCcw size={16}/> Qaytadan</button>
        </div>
      </div>
    );
  }

  return (
    <div className="vocab-practice-container">
      <button className="vocab-back-btn" onClick={onBack}><ArrowLeft size={18} /> Orqaga</button>
      <h2 className="practice-topic-title">{topic.title}</h2>
      <div className="practice-counter">{cardIndex + 1} / {total}</div>

      <div className="practice-progress-bar">
        <div className="practice-progress-fill" style={{ width: `${((cardIndex) / total) * 100}%` }} />
      </div>

      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="card-lang-label">English</span>
            <h1 className="card-word">{word.en}</h1>
            <p className="card-tap-hint">Bosing — tarjimani ko'ring</p>
          </div>
          <div className="flashcard-back">
            <span className="card-lang-label">{lang === 'RU' ? 'Русский' : "O'zbekcha"}</span>
            <h1 className="card-word">{getNative(word)}</h1>
            <p className="card-native-en">{word.en}</p>
            {lang !== 'RU' && <p className="card-ru">{word.ru}</p>}
          </div>
        </div>
      </div>

      <div className="flashcard-actions">
        <button className="fc-btn fc-no" onClick={handleDontKnow}>
          <X size={22}/> Bilmadim
        </button>
        <button className="fc-btn fc-yes" onClick={handleKnow}>
          <Check size={22}/> Bildim
        </button>
      </div>
    </div>
  );
};

// Topics grid view
const TopicsView = ({ deck, onBack, onSelectTopic }) => {
  return (
    <div className="vocabulary-container">
      <button className="vocab-back-btn" onClick={onBack}><ArrowLeft size={18} /> Orqaga</button>
      <h2 className="vocab-title" style={{ color: deck.color }}>{deck.title}</h2>
      <div className="topics-grid">
        {deck.topics.map(topic => (
          <div key={topic.id} className="topic-list-card" onClick={() => onSelectTopic(topic)}>
            <div className="topic-list-left">
              <div className="topic-book-icon" style={{ background: deck.color + '22', color: deck.color }}>
                <BookOpen size={20}/>
              </div>
              <div className="topic-list-info">
                <h3 className="topic-list-title">{topic.title}</h3>
                <p className="topic-list-meta">{topic.units} unit · {topic.words.length} so'z</p>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-secondary)" />
            <div className="topic-list-progress">
              <div className="topic-progress-bar">
                <div className="topic-progress-fill" style={{ width: '0%', background: deck.color }} />
              </div>
              <span className="topic-progress-pct">0%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===================== MAIN =====================
const Vocabulary = () => {
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (selectedTopic) {
    return <PracticeView topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }

  if (selectedDeck) {
    return (
      <TopicsView
        deck={selectedDeck}
        onBack={() => setSelectedDeck(null)}
        onSelectTopic={setSelectedTopic}
      />
    );
  }

  return (
    <div className="vocabulary-container">
      <div className="vocab-xp">
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>XP</span>
        <div className="xp-bar"></div>
      </div>

      <h2 className="vocab-title">{getTranslation('vocabulary', 'title')}</h2>

      <div className="vocab-decks-list">
        {deckData.map((deck) => (
          <div
            key={deck.id}
            className="vocab-deck-card"
            style={{ background: `linear-gradient(135deg, ${deck.color}dd, ${deck.color}99)` }}
            onClick={() => setSelectedDeck(deck)}
          >
            {deck.isCurrent && <span className="deck-current-badge">Current</span>}
            <div className="deck-level-badge">{deck.level}</div>
            <div className="deck-card-body">
              <div className="deck-info">
                <h3 className="deck-card-title">{deck.title}</h3>
                <p className="deck-card-sub">{deck.topics.length} ta mavzu · {deck.topics.reduce((s, t) => s + t.words.length, 0)} so'z</p>
                <div className="deck-progress-section">
                  <div className="deck-progress-label-row"><span>Progress</span><span>0%</span></div>
                  <div className="deck-progress-bar"><div className="deck-progress-fill" style={{ width: '0%' }} /></div>
                </div>
              </div>
              <button className="deck-play-btn" onClick={(e) => { e.stopPropagation(); setSelectedDeck(deck); }}>
                <Play size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        ))}

        {/* My Vocabulary */}
        <div className="vocab-deck-card vocab-my-words-card">
          <div className="deck-level-badge" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <BookOpen size={12} style={{ marginRight: 4 }} /> My Words
          </div>
          <div className="deck-card-body">
            <div className="deck-info">
              <h3 className="deck-card-title">My Vocabulary</h3>
              <p className="deck-card-sub">Add your own words to study</p>
            </div>
            <button className="deck-play-btn deck-play-btn-dark">
              <Play size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;
