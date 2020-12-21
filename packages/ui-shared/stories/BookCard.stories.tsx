import React from 'react';
import { Meta, Story } from '@storybook/react';
import { BookCard } from '../src';

const meta: Meta = {
  title: 'BookCard',
  component: BookCard,
  argTypes: {
    book: {
      title: 'text',
      author: 'text',
      tag: 'text',
      defaultValue: {
        title: "Clean Code", author: 'Uncle Bob', tag: 'software'
      }
    },
  },
  parameters: {    
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<any> = args => <BookCard {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {}; 
