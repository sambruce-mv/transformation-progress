import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface ChecklistItem {
  title: string;
  description: string;
  done: boolean;
}

interface FirstStepsChecklistProps {
  items: ChecklistItem[];
}

export default function FirstStepsChecklist({ items }: FirstStepsChecklistProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Getting started</Text>
        <Text style={styles.subtitle}>Complete these to begin your transformation</Text>
      </View>

      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.item,
            index === items.length - 1 && styles.itemLast,
          ]}
        >
          <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
            {item.done && (
              <Ionicons name="checkmark" size={12} color="#5DCAA5" />
            )}
          </View>

          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, item.done && styles.itemTitleDone]}>
              {item.title}
            </Text>
            <Text style={styles.itemDesc}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDone: {
    backgroundColor: 'rgba(93,202,165,0.2)',
    borderColor: '#5DCAA5',
  },
  itemContent: {
    flex: 1,
    paddingTop: 2,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemTitleDone: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  itemDesc: {
    fontSize: 12,
    color: '#888',
  },
});
