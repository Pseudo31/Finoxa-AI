# 📈 Finoxa AI – Real-Time Financial News Sentiment Analyzer

Finoxa AI is a real-time sentiment analysis engine designed for financial markets. It continuously scrapes financial news, identifies relevant companies, and uses a fine-tuned FinBERT model to predict stock sentiment and potential price movements. This tool empowers traders, analysts, and algorithmic systems with deeper insight into how breaking news impacts the market.

---

## 🧠 Core Features

- **Live News Ingestion:** Scrapes up-to-date headlines and articles from financial news APIs and websites.
- **Text Segmentation & Ranking:** Breaks down articles into key sentences and ranks them by importance using the TextRank algorithm.
- **Ticker Validation & Mapping:** Identifies and validates company names and ticker symbols using custom entity recognition logic.
- **Fine-Tuned FinBERT Sentiment Engine:** Performs sentiment classification with a custom-trained FinBERT model optimized for financial language.
- **Price Movement Indicator:** Predicts directional movement (positive, negative, neutral) based on sentiment strength.

---

## 🏗️ System Architecture

News Source ➜ Sentence Split ➜ TextRank ➜ Ticker Extraction ➜ FinBERT Sentiment ➜ Stock Signal


---

## 🔍 Example Use Case

> **Input Article:** “NVIDIA posts record-breaking earnings; AI chip sales drive 24% increase in revenue.”  
> **Output:**
> - Company: $NVDA  
> - Sentiment: Positive  
> - Movement: Likely upward  
> - Confidence: 91%

---

## 🛠️ Tech Stack

- Python
- BeautifulSoup, Requests (Scraping)
- spaCy, NLTK (Text Processing)
- HuggingFace Transformers (FinBERT)
- Pandas, NumPy
- Regex, YAML for ticker resolution

---

## ⚙️ Getting Started

```bash
git clone https://github.com/yourusername/market-mind-ai.git
cd market-mind-ai
pip install -r requirements.txt
python main.py
