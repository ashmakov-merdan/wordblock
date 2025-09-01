import { View, StyleSheet, Text } from "react-native";
import WordBlock from "../word-block";
import React, { useEffect, useState, useCallback } from "react";

// Use the original words array that the user had
const words = ['fruit', 'vegetable', 'building', 'object', 'animal', 'personality', 'emotion', 'relationship', 'environment', 'tree', 'car', 'book'];

const WordBlocks = React.memo(() => {
  // Get 6 random words from the array
  const [randomWords, setRandomWords] = useState<string[]>([]);

  const loadRandomWords = useCallback(() => {
    // Shuffle the words array and take 6 random ones
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 6);
    console.log('Selected random words:', selectedWords);
    setRandomWords(selectedWords);
  }, []);

  useEffect(() => {
    loadRandomWords();
  }, [loadRandomWords]);

  // Predefined positions for the word blocks to ensure good distribution
  const positions = [
    { x: 0, y: 0 },
    { x: 120, y: 20 },
    { x: 240, y: 0 },
    { x: 60, y: 80 },
    { x: 180, y: 100 },
    { x: 300, y: 80 },
  ];

  console.log('Rendering WordBlocks with words:', randomWords);

  // If no words loaded yet, show loading state
  if (randomWords.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading words...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {randomWords.map((word, index) => (
        <WordBlock
          key={`${word}-${index}`}
          word={word}
          delay={index * 300} // Increased delay for slower staggered effect
          position={positions[index] || { x: 0, y: 0 }}
          animationVariant={index} // Different animation pattern for each block
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    position: 'relative',
    width: '100%',
    height: 180, // Reduced height for better fit
    marginTop: 30, // Add margin to separate from hero description
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light background for loading
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
});

WordBlocks.displayName = 'WordBlocks';

export default WordBlocks;