import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ExternalLink } from '@/components/external-link';

const BACKGROUND = '#0F172A';
const TEXT = '#F8FAFC';
const PRIMARY = '#0EA5E9';
const ANSWER_HEIGHT = 62;
const BALL_SIZE = 32;
const ANSWER_LETTERS = ['a)', 'b)', 'c)', 'd)'] as const;

const QUESTIONS = [
  {
    prompt: 'Por que o lixo plástico no oceano é perigoso para os animais marinhos?',
    choices: [
      'Eles podem confundi-lo com alimento ou ficar presos nele.',
      'O plástico pode chegar perto dos animais, mas não afeta sua saúde.',
      'O plástico serve de alimento natural para os peixes.',
      'Ele se dissolve na água do mar em poucos minutos.',
    ],
    correctAnswer: 0,
  },
  {
    prompt: 'Qual atitude ajuda a reduzir o uso de plástico descartável?',
    choices: [
      'Reutilizar uma sacola descartável algumas vezes, mesmo que depois ela seja jogada no lixo comum.',
      'Levar uma garrafa reutilizável e abastecê-la quando necessário.',
      'Trocar garrafas plásticas por copos descartáveis.',
      'Usar mais embalagens para manter os produtos protegidos.',
    ],
    correctAnswer: 1,
  },
  {
    prompt: 'O que devemos fazer com o lixo ao visitar uma praia?',
    choices: [
      'Juntar o lixo que está perto de nós, mas deixar o restante na areia.',
      'Colocá-lo em uma lixeira adequada ou levá-lo conosco.',
      'Enterrá-lo, para que não fique visível.',
      'Deixá-lo na areia, pois a maré vai levá-lo para longe.',
    ],
    correctAnswer: 1,
  },
  {
    prompt: 'Qual é um benefício da reciclagem?',
    choices: [
      'Reduz a quantidade de alguns materiais descartados, mas não evita todo tipo de poluição.',
      'Faz com que qualquer material possa ser reciclado repetidas vezes.',
      'Elimina a necessidade de reduzir o consumo e reutilizar produtos.',
      'Ajuda a diminuir resíduos e o uso de recursos naturais, embora não substitua a redução do consumo.',
    ],
    correctAnswer: 3,
  },
  {
    prompt: 'Como devemos descartar o óleo de cozinha usado?',
    choices: [
      'Jogando-o na pia com água quente para facilitar a passagem pelo encanamento.',
      'Colocando-o em uma garrafa e descartando-a na lixeira comum, sem verificar outras opções.',
      'Guardando-o em um recipiente fechado e levando-o a um ponto de coleta apropriado.',
      'Despejando-o no solo, onde pode se misturar à terra.',
    ],
    correctAnswer: 2,
  },
] as const;

const RESULT_MESSAGES = [
  'Todo grande cuidado começa com uma pequena atitude. O oceano precisa de cada um de nós!',
  'Cada nova descoberta pode inspirar uma atitude melhor para proteger os oceanos.',
  'Pequenas escolhas, como reduzir o uso de plástico, ajudam a cuidar da vida marinha.',
  'Suas atitudes fazem diferença: compartilhe o cuidado com o oceano com quem está por perto.',
  'Você está no caminho certo! Continue aprendendo e protegendo os nossos oceanos.',
  'Seu conhecimento é uma onda de mudança. Continue inspirando a proteção dos oceanos!',
] as const;

type Screen = 'home' | 'quiz' | 'result';

export default function HomeScreen() {
  const [screen, setScreen] = useState<Screen>('home');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSizes, setAnswerSizes] = useState<
    Record<number, { width: number; height: number }>
  >({});
  const [ballScale] = useState(() => new Animated.Value(0));
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
      }
    },
    [],
  );

  function startQuiz() {
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    ballScale.setValue(0);
    setScreen('quiz');
  }

  function returnToHome() {
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    ballScale.setValue(0);
    setScreen('home');
  }

  function selectAnswer(answerIndex: number) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === QUESTIONS[questionIndex].correctAnswer;
    if (isCorrect) {
      setScore((currentScore) => currentScore + 1);
    }

    const answerSize = answerSizes[answerIndex];
    const scaleToCoverButton =
      Math.hypot(
        answerSize?.width ?? 0,
        answerSize?.height ?? ANSWER_HEIGHT,
      ) /
        BALL_SIZE +
      1;

    Animated.timing(ballScale, {
      toValue: scaleToCoverButton,
      duration: 550,
      useNativeDriver: Platform.OS !== 'web',
    }).start(({ finished }) => {
      if (!finished) return;

      transitionTimer.current = setTimeout(() => {
        if (questionIndex === QUESTIONS.length - 1) {
          setScreen('result');
          return;
        }

        setQuestionIndex((currentIndex) => currentIndex + 1);
        setSelectedAnswer(null);
        ballScale.setValue(0);
      }, 500);
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {screen === 'home' && (
        <View style={styles.homeContent}>
          <Text style={styles.introText}>
            Nossos oceanos precisam de ajuda. Teste sua consciência ambiental!
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={startQuiz}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressedButton,
            ]}>
            <Text style={styles.primaryButtonText}>Começar Quiz</Text>
          </Pressable>
        </View>
      )}

      {screen === 'quiz' && (
        <ScrollView
          contentContainerStyle={styles.quizContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.progressText}>
            PERGUNTA {questionIndex + 1} DE {QUESTIONS.length}
          </Text>
          <View
            accessibilityRole="summary"
            style={styles.questionBubble}>
            <Text style={styles.questionText}>
              {QUESTIONS[questionIndex].prompt}
            </Text>
          </View>

          <View style={styles.answers}>
            {QUESTIONS[questionIndex].choices.map((choice, answerIndex) => {
              const isSelected = selectedAnswer === answerIndex;
              const answerIsCorrect =
                answerIndex === QUESTIONS[questionIndex].correctAnswer;

              return (
                <Pressable
                  key={ANSWER_LETTERS[answerIndex]}
                  accessibilityRole="button"
                  accessibilityLabel={`Alternativa ${ANSWER_LETTERS[answerIndex][0]}`}
                  accessibilityState={{ disabled: selectedAnswer !== null }}
                  disabled={selectedAnswer !== null}
                  onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    setAnswerSizes((currentSizes) => {
                      const previousSize = currentSizes[answerIndex];
                      if (
                        previousSize?.width === width &&
                        previousSize.height === height
                      ) {
                        return currentSizes;
                      }

                      return { ...currentSizes, [answerIndex]: { width, height } };
                    });
                  }}
                  onPress={() => selectAnswer(answerIndex)}
                  style={({ pressed }) => [
                    styles.answerBubble,
                    pressed && selectedAnswer === null && styles.pressedAnswer,
                  ]}>
                  <View style={styles.answerContent}>
                    <Text style={styles.answerLetter}>
                      {ANSWER_LETTERS[answerIndex]}
                    </Text>
                    <Text style={styles.answerText}>{choice}</Text>
                  </View>
                  {isSelected && (
                    <Animated.View
                      pointerEvents="none"
                      style={[
                        styles.answerBall,
                        {
                          backgroundColor: answerIsCorrect ? '#22C55E' : '#EF4444',
                          transform: [{ scale: ballScale }],
                        },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}

      {screen === 'result' && (
        <ScrollView
          contentContainerStyle={styles.resultContent}
          showsVerticalScrollIndicator={false}>
          <Text
            accessibilityLabel="Ilustração de uma onda do oceano"
            style={styles.oceanIllustration}>
            🌊
          </Text>
          <Text style={styles.scoreText}>({score} de 5)</Text>
          <Text style={styles.resultMessage}>{RESULT_MESSAGES[score]}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={returnToHome}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressedButton,
            ]}>
            <Text style={styles.primaryButtonText}>Voltar ao Inicio</Text>
          </Pressable>
          <ExternalLink
            href="https://exposicaodeculturaoceanica.com.br/"
            asChild
            style={styles.secondaryButton}>
            <Pressable
              accessibilityRole="link"
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressedButton,
              ]}>
              <Text style={styles.secondaryButtonText}>
                Saiba mais sobre nossos oceanos!
              </Text>
            </Pressable>
          </ExternalLink>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  homeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 28,
    gap: 30,
  },
  introText: {
    color: TEXT,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    borderRadius: 18,
    backgroundColor: PRIMARY,
  },
  primaryButtonText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressedButton: {
    opacity: 0.82,
  },
  quizContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 22,
  },
  progressText: {
    color: '#7DD3FC',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  questionBubble: {
    minHeight: 164,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.35)',
    borderRadius: 28,
    backgroundColor: 'rgba(14, 165, 233, 0.35)',
  },
  questionText: {
    color: '#7DD3FC',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 31,
    textAlign: 'center',
  },
  answers: {
    gap: 12,
  },
  answerBubble: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  answerContent: {
    width: '100%',
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  answerLetter: {
    width: 30,
    color: '#000000',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  answerText: {  
    minWidth: 0,
    flex: 1,
    flexShrink: 1,
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'left',
  },
  answerBall: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: BALL_SIZE,
    height: BALL_SIZE,
    marginLeft: -BALL_SIZE / 2,
    marginTop: -BALL_SIZE / 2,
    borderRadius: BALL_SIZE / 2,
  },
  pressedAnswer: {
    opacity: 0.8,
  },
  resultContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 28,
    paddingVertical: 32,
    gap: 22,
  },
  oceanIllustration: {
    fontSize: 76,
  },
  scoreText: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultMessage: {
    color: TEXT,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  secondaryButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#1E293B',
  },
  secondaryButtonText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
