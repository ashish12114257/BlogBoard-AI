// Mock seed data used by the centralized API service.
// This mirrors the structure the Spring Boot backend will eventually provide.

export const categories = [
  {
    slug: 'ml',
    label: 'Machine Learning',
    shortLabel: 'ML',
    description:
      'Algorithms, theory, and applied ML from fundamentals to production.',
    color: '#4f46e5',
  },
  {
    slug: 'dl',
    label: 'Deep Learning',
    shortLabel: 'DL',
    description:
      'Neural networks, architectures, training tricks, and modern DL research.',
    color: '#0d9488',
  },
  {
    slug: 'statistics',
    label: 'Statistics for AI',
    shortLabel: 'Stats',
    description:
      'Probability, statistical tests, distributions, and the math behind ML.',
    color: '#ea580c',
  },
  {
    slug: 'nlp',
    label: 'Natural Language Processing',
    shortLabel: 'NLP',
    description:
      'Text processing, transformers, LLMs, and language understanding.',
    color: '#e11d48',
  },
  {
    slug: 'cv',
    label: 'Computer Vision',
    shortLabel: 'CV',
    description:
      'Image processing, object detection, segmentation, and visual AI.',
    color: '#d97706',
  },
  {
    slug: 'genai',
    label: 'Generative AI',
    shortLabel: 'Gen AI',
    description:
      'Diffusion models, LLMs, RAG, agents, and the frontier of AI generation.',
    color: '#9333ea',
  },
  {
    slug: 'ainews',
    label: 'AI News',
    shortLabel: 'AI News',
    description:
      'Breaking developments, model releases, and industry analysis.',
    color: '#059669',
  },
];

export const seedArticles = [
  {
    id: '1',
    slug: 'machine-learning-explained',
    title: 'Machine Learning Explained',
    description:
      'A beginner-friendly introduction to machine learning, its types, and how it is used across industries.',
    category: 'ml',
    tags: ['machine-learning', 'ai', 'supervised-learning'],
    author: 'Kalyan',
    date: '2026-03-02',
    readTime: '6 min',
    featured: true,
    content: `## Introduction

Machine learning is a subset of artificial intelligence that involves training algorithms to learn from data and make predictions without being explicitly programmed. At its core, machine learning is about enabling computers to automatically improve their performance on a task based on experience or data.

## Types of Machine Learning

There are three main types of machine learning, each suited to different problems:

| Type | Description | Example |
| --- | --- | --- |
| Supervised Learning | The model is trained on labeled data. | Image classification |
| Unsupervised Learning | The model finds patterns in unlabeled data. | Clustering |
| Reinforcement Learning | The model learns through trial and error. | Game playing |

## A Simple Example

Suppose we want to build a system that classifies images of dogs and cats. We train a model using a dataset of labeled images, and the model learns to recognize patterns that generalize to new images.

## Conclusion

Machine learning powers everything from recommendation systems to self-driving cars. Understanding the fundamentals is the first step toward building intelligent, data-driven products.`,
  },
  {
    id: '2',
    slug: 'model-evaluation-guide',
    title: 'A Practical Guide to Model Evaluation',
    description:
      'Learn how to properly evaluate machine learning models with accuracy, precision, recall, and ROC curves.',
    category: 'ml',
    tags: ['evaluation', 'metrics', 'ml'],
    author: 'Kalyan',
    date: '2026-03-10',
    readTime: '7 min',
    featured: true,
    content: `## Why Evaluation Matters

A model that performs well on training data can fail in production. Proper evaluation tells us whether a model will generalize to unseen data.

## Confusion Matrix Basics

The confusion matrix summarizes predictions versus actual values into four categories: true positives, false positives, true negatives, and false negatives.

## Key Metrics

- **Accuracy** — the fraction of correct predictions.
- **Precision** — how many positive predictions were actually correct.
- **Recall** — how many actual positives were found.
- **F1 Score** — the harmonic mean of precision and recall.

## Validation Strategies

Hold-out validation and k-fold cross-validation are the two most common strategies for estimating model performance on unseen data.

\`\`\`python
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
scores = cross_val_score(model, X, y, cv=5)
print(f"Mean accuracy: {scores.mean():.2f}")
\`\`\`

## Conclusion

Choose metrics that match your business problem. Accuracy is rarely enough on its own.`,
  },
  {
    id: '3',
    slug: 'deep-learning-intro',
    title: 'Deep Learning for Beginners',
    description:
      'Learn the fundamentals of deep learning, from perceptrons to modern neural network architectures.',
    category: 'dl',
    tags: ['deep-learning', 'neural-networks', 'ai'],
    author: 'Kalyan',
    date: '2026-03-03',
    readTime: '8 min',
    featured: true,
    content: `## What Is Deep Learning?

Deep learning is a branch of machine learning built on artificial neural networks with many layers. These networks learn hierarchical representations of data, from raw features to high-level concepts.

## The Perceptron

The perceptron is the simplest neural unit: it multiplies inputs by weights, sums them, and passes the result through an activation function.

## Training a Network

Networks learn by minimizing a loss function using backpropagation and gradient descent. Each training step nudges the weights to reduce error.

\`\`\`python
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(28 * 28, 128),
    nn.ReLU(),
    nn.Linear(128, 10),
)
optimizer = torch.optim.Adam(model.parameters())
\`\`\`

## Common Architectures

CNNs dominate computer vision tasks, RNNs and transformers handle sequential data, and autoencoders learn efficient representations.

## Conclusion

Deep learning is powerful but data-hungry. Start small, understand the fundamentals, and scale up gradually.`,
  },
  {
    id: '4',
    slug: 'attention-mechanisms',
    title: 'Attention Mechanisms Explained',
    description:
      'How attention transformed sequence modeling and became the backbone of modern transformer models.',
    category: 'dl',
    tags: ['attention', 'transformers', 'dl'],
    author: 'Kalyan',
    date: '2026-03-12',
    readTime: '9 min',
    content: `## The Problem with Sequences

Traditional RNNs process sequences step by step, making it hard to capture long-range dependencies. Attention lets a model focus directly on relevant parts of the input regardless of distance.

## Self-Attention

In self-attention, each token computes query, key, and value vectors. The dot product between queries and keys produces attention scores that weight the values.

## Multi-Head Attention

Instead of a single attention function, transformers use multiple heads, each learning a different relationship between tokens.

## The Transformer Block

A transformer layer combines multi-head attention with a feed-forward network, residual connections, and layer normalization.

## Why It Matters

Attention is the core idea behind GPT, BERT, and virtually every modern language model. Understanding it unlocks the rest of the transformer stack.`,
  },
  {
    id: '5',
    slug: 'tokenization-nlp',
    title: 'Tokenization in Natural Language Processing',
    description:
      'An overview of word, subword, and character tokenization and how tokenizers prepare text for models.',
    category: 'nlp',
    tags: ['nlp', 'tokenization', 'text'],
    author: 'Kalyan',
    date: '2026-03-05',
    readTime: '5 min',
    content: `## What Is Tokenization?

Tokenization splits raw text into smaller pieces, called tokens, that a model can process. It is the first step in almost every NLP pipeline.

## Word Tokenization

The simplest approach splits text on whitespace and punctuation. It is intuitive but struggles with rare words and large vocabularies.

## Subword Tokenization

Methods like Byte-Pair Encoding (BPE) and WordPiece break words into common subword units. They balance vocabulary size and expressiveness.

## Character Tokenization

Character-level tokenization uses a tiny vocabulary but produces long sequences, making it expensive for large models.

## Choosing a Tokenizer

The right choice depends on your language, dataset, and model. Modern LLMs rely on subword tokenizers for their balance of efficiency and coverage.`,
  },
  {
    id: '6',
    slug: 'introduction-to-embeddings',
    title: 'Introduction to Embeddings',
    description:
      'What embeddings are, how they capture meaning, and why they power modern search and language models.',
    category: 'nlp',
    tags: ['embeddings', 'nlp', 'vectors'],
    author: 'Kalyan',
    date: '2026-03-14',
    readTime: '6 min',
    content: `## From Words to Vectors

Embeddings map words, sentences, or documents into dense vectors where similar meanings are close together in space.

## Why Distance Matters

Once text is represented as vectors, we can measure similarity with cosine distance and use it for search, clustering, and recommendation.

## Learning Embeddings

Early methods like Word2Vec learned embeddings from co-occurrence statistics. Modern models learn contextual embeddings that change based on surrounding words.

\`\`\`python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
vec = model.encode("Machine learning is fascinating")
\`\`\`

## Beyond Text

Embeddings are not limited to language — they are used for images, audio, and graphs too.

## Conclusion

Embeddings bridge the gap between human meaning and numerical computation, making them a foundational tool for AI systems.`,
  },
  {
    id: '7',
    slug: 'image-classification-cnns',
    title: 'Image Classification with Convolutional Neural Networks',
    description:
      'How CNNs learn to recognize images, from convolutional filters to fully connected classifiers.',
    category: 'cv',
    tags: ['cnn', 'computer-vision', 'image'],
    author: 'Kalyan',
    date: '2026-03-06',
    readTime: '7 min',
    content: `## Why CNNs for Images

Fully connected networks ignore spatial structure. Convolutional layers scan local regions of an image, learning patterns that are translation invariant.

## The Convolutional Layer

A convolution applies a small filter across the image, producing a feature map that highlights specific patterns such as edges or textures.

## Pooling

Pooling layers downsample feature maps, reducing computation and making the network more robust to small shifts in the input.

## Putting It Together

A typical CNN stacks convolutions and pooling layers, then flattens the final feature maps into a classifier.

\`\`\`python
import torch.nn as nn

model = nn.Sequential(
    nn.Conv2d(3, 32, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Flatten(),
    nn.Linear(32 * 112 * 112, 10),
)
\`\`\`

## Conclusion

CNNs remain the foundation of modern computer vision, and their design principles carry over into vision transformers.`,
  },
  {
    id: '8',
    slug: 'object-detection-overview',
    title: 'Object Detection: A Practical Overview',
    description:
      'From bounding boxes to YOLO and modern detection frameworks, learn how systems find objects in images.',
    category: 'cv',
    tags: ['object-detection', 'yolo', 'cv'],
    author: 'Kalyan',
    date: '2026-03-15',
    readTime: '8 min',
    content: `## Classification vs. Detection

Image classification answers \`what is in this image?\` Object detection also answers \`where is it?\` by predicting bounding boxes.

## Classic Approaches

Early detectors used sliding windows and handcrafted features. These were slow and brittle compared to modern deep learning methods.

## Two-Stage Detectors

Region-based methods like R-CNN first propose candidate regions, then classify each region. They are accurate but slow.

## Single-Stage Detectors

YOLO and SSD predict boxes and classes in one pass, trading a little accuracy for real-time speed.

## Practical Considerations

Choose a detector based on your latency budget, hardware, and accuracy requirements. YOLO variants are a solid default for most applications.`,
  },
  {
    id: '9',
    slug: 'generative-models-intro',
    title: 'Introduction to Generative Models',
    description:
      'A tour of GANs, VAEs, and diffusion models, and how machines learn to create new content.',
    category: 'genai',
    tags: ['generative-ai', 'gan', 'diffusion'],
    author: 'Kalyan',
    date: '2026-03-07',
    readTime: '8 min',
    content: `## What Is a Generative Model?

Generative models learn the underlying distribution of data and can produce new samples that resemble the training set — text, images, audio, and more.

## Variational Autoencoders

VAEs compress data into a latent space and then decode it back. Sampling from the latent space generates new examples.

## Generative Adversarial Networks

GANs pit a generator against a discriminator. The generator learns to create realistic samples while the discriminator tries to distinguish real from fake.

## Diffusion Models

Diffusion models gradually add noise to data, then learn to reverse the process. They power modern text-to-image systems.

## Conclusion

Each family of generative models balances quality, diversity, and training stability. Diffusion models currently lead in image quality.`,
  },
  {
    id: '10',
    slug: 'rag-explained',
    title: 'Retrieval-Augmented Generation Explained',
    description:
      'How RAG combines retrieval with LLMs to answer questions grounded in your own documents.',
    category: 'genai',
    tags: ['rag', 'llm', 'genai'],
    author: 'Kalyan',
    date: '2026-03-16',
    readTime: '7 min',
    content: `## The Problem with Raw LLMs

Large language models can hallucinate and lack access to private or up-to-date information. RAG addresses both issues by grounding answers in retrieved documents.

## How RAG Works

1. A query is embedded into a vector.
2. A retrieval system finds the most relevant document chunks.
3. The LLM generates an answer using only the retrieved context.

## The Components

RAG systems need an embedding model, a vector store, and an LLM. Chunking strategy and retrieval quality often matter more than the model itself.

\`\`\`python
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

store = FAISS.from_documents(docs, OpenAIEmbeddings())
results = store.similarity_search("What is RAG?")
\`\`\`

## When to Use RAG

Use RAG when you need factual, grounded answers over a specific corpus — customer support, internal knowledge bases, or research assistants.`,
  },
  {
    id: '11',
    slug: 'statistics-for-ml',
    title: 'Statistics for Machine Learning',
    description:
      'The statistical concepts every ML practitioner should know, from distributions to bias-variance tradeoffs.',
    category: 'statistics',
    tags: ['statistics', 'probability', 'ml'],
    author: 'Kalyan',
    date: '2026-03-08',
    readTime: '6 min',
    content: `## Why Statistics Matter

Machine learning is applied statistics. Every model, metric, and evaluation procedure is built on statistical reasoning.

## Distributions

The normal distribution underpins many statistical methods. Understanding distributions helps you reason about data and model outputs.

## Central Limit Theorem

The CLT tells us that the mean of many independent samples tends toward a normal distribution, which justifies many inference procedures.

## Bias and Variance

A model's error decomposes into bias, variance, and irreducible noise. Balancing bias and variance is the core of model selection.

## Statistical Tests

Hypothesis tests help answer questions like \`does this feature matter?\` in a principled way. Use them to validate assumptions before trusting results.`,
  },
  {
    id: '12',
    slug: 'hypothesis-testing',
    title: 'Hypothesis Testing Fundamentals',
    description:
      'A clear introduction to null hypotheses, p-values, and confidence intervals in practice.',
    category: 'statistics',
    tags: ['statistics', 'hypothesis-testing', 'p-values'],
    author: 'Kalyan',
    date: '2026-03-17',
    readTime: '5 min',
    content: `## The Idea

Hypothesis testing formalizes how we decide whether an observed effect is real or due to chance.

## Null and Alternative Hypotheses

We start with a null hypothesis (no effect) and gather evidence to reject it in favor of an alternative.

## p-Values

A p-value is the probability of observing the data if the null hypothesis were true. A small p-value suggests the effect is unlikely to be due to chance.

## Confidence Intervals

Confidence intervals give a range of plausible values for a parameter. They communicate uncertainty more honestly than a single p-value.

## Common Pitfalls

- A small p-value is not \`proof\` of an effect.
- Statistical significance is not the same as practical significance.
- Always report effect sizes, not just p-values.`,
  },
  {
    id: '13',
    slug: 'week-in-ai',
    title: 'The Week in AI',
    description:
      'A roundup of the biggest AI announcements, research releases, and industry moves from the past week.',
    category: 'ainews',
    tags: ['ainews', 'weekly-roundup'],
    author: 'Kalyan',
    date: '2026-02-27',
    readTime: '7 min',
    content: `## Big Announcements

The past week brought major releases from leading labs, new open-source models, and significant enterprise adoption news.

## Research Highlights

Several papers pushed the frontier of reasoning and multimodal understanding. Open weights continue to close the gap with proprietary systems.

## Industry Moves

Funding and partnerships accelerated across the AI stack, from chips to applications. Enterprises are moving from experimentation to production.

## What It Means

The pace of change shows no signs of slowing. Staying informed is essential for anyone building with AI.`,
  },
  {
    id: '14',
    slug: 'latest-ai-breakthroughs',
    title: 'Latest AI Breakthroughs Worth Watching',
    description:
      'From reasoning models to real-time video generation, the breakthroughs defining the current AI era.',
    category: 'ainews',
    tags: ['ainews', 'breakthroughs', 'ai'],
    author: 'Kalyan',
    date: '2026-03-18',
    readTime: '6 min',
    content: `## Reasoning at Scale

New models spend more computation on inference, dramatically improving performance on complex math and coding tasks.

## Multimodal Convergence

Text, image, and audio are increasingly handled by a single model, enabling richer applications and simpler pipelines.

## Real-Time Generation

Latency has dropped enough that AI-generated video and voice are now viable in interactive products.

## Practical Takeaways

For builders, the key is to track these developments, evaluate them against your own workloads, and adopt when the quality and cost make sense.`,
  },
];