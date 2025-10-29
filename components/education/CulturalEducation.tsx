/**
 * CULTURAL EDUCATION COMPONENT
 * 
 * Interactive educational content about 60s psychedelic culture
 * Includes lessons, quizzes, and interactive experiences
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

import React, { useState, useEffect } from 'react';
import { AUTHENTIC_60S_PALETTES } from '@/lib/palette/Authentic60sPalettes';
import { PERIOD_ACCURATE_EFFECTS, EFFECT_PRESETS } from '@/lib/visual/PeriodAccurateEffects';
import { getCulturalElement } from '@/lib/cultural/RespectfulRepresentation';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: {
    sections: {
      title: string;
      content: string;
      type: 'text' | 'image' | 'video' | 'interactive';
      data?: any;
    }[];
  };
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  prerequisites: string[];
  learningObjectives: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'fill-in-blank' | 'matching';
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;
    culturalContext: string;
  }[];
  passingScore: number; // percentage
  timeLimit: number; // in minutes
}

export interface InteractiveExperience {
  id: string;
  title: string;
  description: string;
  type: 'timeline' | 'gallery' | 'simulation' | 'game';
  content: {
    elements: {
      id: string;
      type: string;
      data: any;
    }[];
  };
  learningObjectives: string[];
  duration: number; // in minutes
}

const CULTURAL_LESSONS: Lesson[] = [
  {
    id: 'introduction-to-60s-culture',
    title: 'Introduction to 60s Psychedelic Culture',
    description: 'Learn about the cultural movements and artistic expressions of the 1960s',
    content: {
      sections: [
        {
          title: 'Historical Context',
          content: 'The 1960s was a decade of profound cultural change, marked by the emergence of psychedelic culture, the hippie movement, and counterculture art. This period saw the rise of new forms of artistic expression, particularly in music, visual art, and fashion.',
          type: 'text',
        },
        {
          title: 'Key Movements',
          content: 'The 60s saw several interconnected cultural movements: the Beat Generation, the British Invasion, the Psychedelic Art movement, the Hippie movement, and the Underground Comics movement. Each contributed unique elements to the visual and cultural landscape.',
          type: 'text',
        },
        {
          title: 'Visual Characteristics',
          content: '60s psychedelic art is characterized by vibrant, saturated colors, organic flowing shapes, high contrast combinations, and electric, neon-like intensity. These elements were used to create immersive visual experiences.',
          type: 'text',
        },
        {
          title: 'Cultural Significance',
          content: 'The visual culture of the 60s represented a rejection of mainstream society and an embrace of alternative values, including peace, love, freedom, and self-expression. It continues to influence modern art and design.',
          type: 'text',
        },
      ],
    },
    duration: 15,
    difficulty: 'beginner',
    topics: ['history', 'culture', 'art', 'movements'],
    prerequisites: [],
    learningObjectives: [
      'Understand the historical context of 60s psychedelic culture',
      'Identify key cultural movements and their characteristics',
      'Recognize visual elements of 60s psychedelic art',
      'Appreciate the cultural significance of the era',
    ],
  },
  {
    id: 'psychedelic-art-techniques',
    title: 'Psychedelic Art Techniques',
    description: 'Explore the visual techniques and methods used in psychedelic art',
    content: {
      sections: [
        {
          title: 'Color Theory',
          content: 'Psychedelic art uses vibrant, saturated colors to create intense visual experiences. Color combinations often include complementary colors, triadic harmonies, and high-contrast pairings.',
          type: 'text',
        },
        {
          title: 'Morphing and Transformation',
          content: 'Morphing between organic shapes creates fluid, dynamic visual experiences. This technique was used in light shows and poster art to create hypnotic effects.',
          type: 'text',
        },
        {
          title: 'Kaleidoscope Effects',
          content: 'Symmetrical patterns with rotating elements create kaleidoscope-like effects. These patterns were used to create mandala-like visual experiences.',
          type: 'text',
        },
        {
          title: 'Op Art Techniques',
          content: 'High-contrast geometric patterns create optical illusions and visual effects. These techniques were used to create dynamic, engaging visual experiences.',
          type: 'text',
        },
      ],
    },
    duration: 20,
    difficulty: 'intermediate',
    topics: ['art', 'techniques', 'visual-effects', 'color-theory'],
    prerequisites: ['introduction-to-60s-culture'],
    learningObjectives: [
      'Understand color theory in psychedelic art',
      'Learn about morphing and transformation techniques',
      'Explore kaleidoscope and mandala effects',
      'Study Op Art techniques and applications',
    ],
  },
  {
    id: 'light-show-history',
    title: 'History of Psychedelic Light Shows',
    description: 'Discover the origins and evolution of psychedelic light shows',
    content: {
      sections: [
        {
          title: 'Early Light Shows',
          content: 'Psychedelic light shows began in the mid-1960s with the use of oil projectors, slide projectors, and overhead projectors to create immersive visual experiences.',
          type: 'text',
        },
        {
          title: 'Fillmore West and Avalon Ballroom',
          content: 'The Fillmore West and Avalon Ballroom in San Francisco became centers of psychedelic light show innovation, with artists like Joshua White pioneering new techniques.',
          type: 'text',
        },
        {
          title: 'Techniques and Equipment',
          content: 'Light shows used various techniques including oil and water projection, slide morphing, shadow projection, and strobe effects to create dynamic visual experiences.',
          type: 'text',
        },
        {
          title: 'Cultural Impact',
          content: 'Light shows became an integral part of psychedelic culture, providing visual accompaniment to music and creating immersive experiences for audiences.',
          type: 'text',
        },
      ],
    },
    duration: 25,
    difficulty: 'intermediate',
    topics: ['light-shows', 'history', 'techniques', 'culture'],
    prerequisites: ['introduction-to-60s-culture'],
    learningObjectives: [
      'Learn about the origins of psychedelic light shows',
      'Understand the techniques and equipment used',
      'Explore the cultural impact of light shows',
      'Study the evolution of light show technology',
    ],
  },
];

const CULTURAL_QUIZZES: Quiz[] = [
  {
    id: '60s-culture-basics',
    title: '60s Culture Basics Quiz',
    description: 'Test your knowledge of 60s psychedelic culture',
    questions: [
      {
        id: 'q1',
        question: 'What was the Summer of Love?',
        type: 'multiple-choice',
        options: [
          'A music festival in 1967',
          'A cultural movement in San Francisco in 1967',
          'A political protest in 1968',
          'A fashion trend in 1966',
        ],
        correctAnswer: 'A cultural movement in San Francisco in 1967',
        explanation: 'The Summer of Love was a cultural movement that took place in San Francisco in 1967, centered around the hippie community and psychedelic culture.',
        culturalContext: 'The Summer of Love represented the peak of the hippie movement and psychedelic culture, with thousands of young people gathering in San Francisco to embrace peace, love, and alternative lifestyles.',
      },
      {
        id: 'q2',
        question: 'Who were the Merry Pranksters?',
        type: 'multiple-choice',
        options: [
          'A band from San Francisco',
          'A group of artists led by Ken Kesey',
          'A political organization',
          'A fashion collective',
        ],
        correctAnswer: 'A group of artists led by Ken Kesey',
        explanation: 'The Merry Pranksters were a group of artists and counterculture figures led by Ken Kesey, known for their Acid Test parties and experimental art.',
        culturalContext: 'The Merry Pranksters were instrumental in popularizing psychedelic culture and experimental art, organizing Acid Test parties that combined psychedelic experiences with artistic expression.',
      },
      {
        id: 'q3',
        question: 'What is Op Art?',
        type: 'multiple-choice',
        options: [
          'Art that uses optical illusions',
          'Art that represents optimism',
          'Art that uses only black and white',
          'Art that represents the ocean',
        ],
        correctAnswer: 'Art that uses optical illusions',
        explanation: 'Op Art (Optical Art) is a movement that uses geometric patterns and optical illusions to create visual effects and engage viewers.',
        culturalContext: 'Op Art emerged in the 1960s and influenced fashion, design, and visual art, creating a new visual language based on geometric patterns and optical effects.',
      },
    ],
    passingScore: 70,
    timeLimit: 10,
  },
  {
    id: 'psychedelic-art-techniques',
    title: 'Psychedelic Art Techniques Quiz',
    description: 'Test your knowledge of psychedelic art techniques',
    questions: [
      {
        id: 'q1',
        question: 'What technique was used in Fillmore West light shows?',
        type: 'multiple-choice',
        options: [
          'Oil and water projection',
          'Digital projection',
          'Laser shows',
          'Holographic displays',
        ],
        correctAnswer: 'Oil and water projection',
        explanation: 'Oil and water projection was a key technique used in Fillmore West light shows, creating fluid, colorful visual effects.',
        culturalContext: 'Oil and water projection was pioneered in psychedelic light shows and became a signature technique of the era, creating the flowing, organic visual effects associated with psychedelic culture.',
      },
      {
        id: 'q2',
        question: 'What is morphing in psychedelic art?',
        type: 'multiple-choice',
        options: [
          'Changing colors rapidly',
          'Transforming between organic shapes',
          'Creating geometric patterns',
          'Using only black and white',
        ],
        correctAnswer: 'Transforming between organic shapes',
        explanation: 'Morphing in psychedelic art refers to the smooth transformation between organic shapes, creating fluid, dynamic visual experiences.',
        culturalContext: 'Morphing was used in psychedelic art to create hypnotic, flowing visual experiences that reflected the fluid nature of psychedelic experiences.',
      },
    ],
    passingScore: 75,
    timeLimit: 15,
  },
];

const INTERACTIVE_EXPERIENCES: InteractiveExperience[] = [
  {
    id: 'timeline-explorer',
    title: '60s Cultural Timeline Explorer',
    description: 'Explore the key events and movements of the 60s through an interactive timeline',
    type: 'timeline',
    content: {
      elements: [
        {
          id: 'beat-generation',
          type: 'event',
          data: {
            year: 1960,
            title: 'Beat Generation Peak',
            description: 'Beat poetry and jazz culture reach their peak influence',
            visualElements: ['beat-generation-palette', 'beat-worn-filter'],
          },
        },
        {
          id: 'british-invasion',
          type: 'event',
          data: {
            year: 1964,
            title: 'British Invasion',
            description: 'Beatles arrive in America, Mod culture explodes',
            visualElements: ['mod-madness-palette', 'mod-sharp-filter'],
          },
        },
        {
          id: 'acid-tests',
          type: 'event',
          data: {
            year: 1966,
            title: 'Acid Tests Begin',
            description: 'Ken Kesey and Merry Pranksters start Acid Test parties',
            visualElements: ['acid-test-palette', 'acid-wash-filter'],
          },
        },
      ],
    },
    learningObjectives: [
      'Understand the chronological development of 60s culture',
      'Learn about key events and their significance',
      'Explore the visual elements associated with each period',
    ],
    duration: 30,
  },
  {
    id: 'art-gallery',
    title: 'Psychedelic Art Gallery',
    description: 'Explore a virtual gallery of psychedelic art with cultural context',
    type: 'gallery',
    content: {
      elements: [
        {
          id: 'fillmore-posters',
          type: 'artwork',
          data: {
            title: 'Fillmore West Posters',
            artist: 'Wes Wilson, Victor Moscoso, Stanley Mouse',
            year: '1966-1969',
            description: 'Iconic posters from Fillmore West concerts',
            culturalContext: 'These posters defined the visual language of psychedelic art',
            visualElements: ['psychedelic-sunset-palette', 'psychedelic-glow-filter'],
          },
        },
        {
          id: 'underground-comics',
          type: 'artwork',
          data: {
            title: 'Underground Comics',
            artist: 'Robert Crumb, Gilbert Shelton',
            year: '1968-1969',
            description: 'Counterculture comics and zines',
            culturalContext: 'Underground comics represented alternative media and counterculture expression',
            visualElements: ['underground-comix-palette', 'acid-wash-filter'],
          },
        },
      ],
    },
    learningObjectives: [
      'Explore psychedelic art and its cultural significance',
      'Learn about key artists and their contributions',
      'Understand the visual elements and techniques used',
    ],
    duration: 45,
  },
];

const CulturalEducation: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<InteractiveExperience | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentSection(0);
  };

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const handleExperienceSelect = (experience: InteractiveExperience) => {
    setSelectedExperience(experience);
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateQuizScore = () => {
    if (!selectedQuiz) return 0;
    
    let correct = 0;
    selectedQuiz.questions.forEach(question => {
      const userAnswer = quizAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correct++;
      }
    });
    
    const score = (correct / selectedQuiz.questions.length) * 100;
    setQuizScore(score);
    return score;
  };

  const renderLesson = () => {
    if (!selectedLesson) return null;

    return (
      <div style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.8)', color: 'white', borderRadius: '8px' }}>
        <h2 style={{ color: '#ff6b35', marginBottom: '20px' }}>
          {selectedLesson.title}
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p>{selectedLesson.description}</p>
          <div style={{ fontSize: '14px', color: '#ccc' }}>
            Duration: {selectedLesson.duration} minutes | Difficulty: {selectedLesson.difficulty}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Learning Objectives:</h3>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {selectedLesson.learningObjectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Content:</h3>
          {selectedLesson.content.sections.map((section, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#ff6b35', marginBottom: '10px' }}>
                {section.title}
              </h4>
              <p>{section.content}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setSelectedLesson(null)}
          style={{
            background: '#ff6b35',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Close Lesson
        </button>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!selectedQuiz) return null;

    return (
      <div style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.8)', color: 'white', borderRadius: '8px' }}>
        <h2 style={{ color: '#ff6b35', marginBottom: '20px' }}>
          {selectedQuiz.title}
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p>{selectedQuiz.description}</p>
          <div style={{ fontSize: '14px', color: '#ccc' }}>
            Time Limit: {selectedQuiz.timeLimit} minutes | Passing Score: {selectedQuiz.passingScore}%
          </div>
        </div>

        {quizScore === null ? (
          <div>
            {selectedQuiz.questions.map((question, index) => (
              <div key={question.id} style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#06ffa5', marginBottom: '10px' }}>
                  {index + 1}. {question.question}
                </h4>
                
                {question.type === 'multiple-choice' && question.options && (
                  <div>
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} style={{ display: 'block', marginBottom: '5px' }}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={quizAnswers[question.id] === option}
                          onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                          style={{ marginRight: '8px' }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <button
              onClick={calculateQuizScore}
              style={{
                background: '#06ffa5',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Submit Quiz
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ color: quizScore >= selectedQuiz.passingScore ? '#06ffa5' : '#ff6b35' }}>
              Quiz Score: {quizScore.toFixed(1)}%
            </h3>
            <p>
              {quizScore >= selectedQuiz.passingScore ? 'Congratulations! You passed!' : 'Try again to improve your score.'}
            </p>
            
            <div style={{ marginTop: '20px' }}>
              {selectedQuiz.questions.map((question, index) => (
                <div key={question.id} style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: '#06ffa5' }}>
                    {index + 1}. {question.question}
                  </h4>
                  <p>
                    <strong>Your Answer:</strong> {quizAnswers[question.id] || 'Not answered'}
                  </p>
                  <p>
                    <strong>Correct Answer:</strong> {question.correctAnswer}
                  </p>
                  <p>
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                  <p style={{ fontSize: '14px', color: '#ccc' }}>
                    <strong>Cultural Context:</strong> {question.culturalContext}
                  </p>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setQuizAnswers({});
                setQuizScore(null);
              }}
              style={{
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Take Another Quiz
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderExperience = () => {
    if (!selectedExperience) return null;

    return (
      <div style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.8)', color: 'white', borderRadius: '8px' }}>
        <h2 style={{ color: '#ff6b35', marginBottom: '20px' }}>
          {selectedExperience.title}
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <p>{selectedExperience.description}</p>
          <div style={{ fontSize: '14px', color: '#ccc' }}>
            Duration: {selectedExperience.duration} minutes
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Learning Objectives:</h3>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {selectedExperience.learningObjectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#06ffa5', marginBottom: '10px' }}>Interactive Content:</h3>
          <p>This is a placeholder for the interactive experience. In a full implementation, this would include:</p>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Interactive timeline with clickable events</li>
            <li>Virtual art gallery with cultural context</li>
            <li>Simulation of light show techniques</li>
            <li>Educational games and activities</li>
          </ul>
        </div>

        <button
          onClick={() => setSelectedExperience(null)}
          style={{
            background: '#ff6b35',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Close Experience
        </button>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.9)', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#ff6b35', textAlign: 'center', marginBottom: '40px' }}>
        Cultural Education Center
      </h1>

      {selectedLesson && renderLesson()}
      {selectedQuiz && renderQuiz()}
      {selectedExperience && renderExperience()}

      {!selectedLesson && !selectedQuiz && !selectedExperience && (
        <div>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#06ffa5', marginBottom: '20px' }}>Lessons</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {CULTURAL_LESSONS.map((lesson) => (
                <div
                  key={lesson.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  onClick={() => handleLessonSelect(lesson)}
                >
                  <h3 style={{ color: '#ff6b35', marginBottom: '10px' }}>
                    {lesson.title}
                  </h3>
                  <p style={{ marginBottom: '10px' }}>{lesson.description}</p>
                  <div style={{ fontSize: '14px', color: '#ccc' }}>
                    Duration: {lesson.duration} min | Difficulty: {lesson.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#06ffa5', marginBottom: '20px' }}>Quizzes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {CULTURAL_QUIZZES.map((quiz) => (
                <div
                  key={quiz.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  onClick={() => handleQuizSelect(quiz)}
                >
                  <h3 style={{ color: '#ff6b35', marginBottom: '10px' }}>
                    {quiz.title}
                  </h3>
                  <p style={{ marginBottom: '10px' }}>{quiz.description}</p>
                  <div style={{ fontSize: '14px', color: '#ccc' }}>
                    Questions: {quiz.questions.length} | Time: {quiz.timeLimit} min
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ color: '#06ffa5', marginBottom: '20px' }}>Interactive Experiences</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {INTERACTIVE_EXPERIENCES.map((experience) => (
                <div
                  key={experience.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  onClick={() => handleExperienceSelect(experience)}
                >
                  <h3 style={{ color: '#ff6b35', marginBottom: '10px' }}>
                    {experience.title}
                  </h3>
                  <p style={{ marginBottom: '10px' }}>{experience.description}</p>
                  <div style={{ fontSize: '14px', color: '#ccc' }}>
                    Type: {experience.type} | Duration: {experience.duration} min
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalEducation;
