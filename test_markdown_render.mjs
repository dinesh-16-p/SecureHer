import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const sampleResponse = `# Personal Safety Tips

**Stay alert and trust your instincts.**

Here are three useful steps:

* Keep your phone charged.
* Share your journey with someone you trust.
* Move to a safer public location if you feel threatened.

## During an Emergency

1. Use the SOS feature when necessary.
2. Share your location if you choose to do so.
3. Contact local emergency services when appropriate.`;

const tableAndCodeSample = `### Emergency Services Table

| Service | Number | Availability |
| :--- | :--- | :--- |
| National Emergency | 112 | 24/7 |
| Women Helpline | 1091 | 24/7 |

Here is an inline code: \`navigator.geolocation.getCurrentPosition()\`

\`\`\`javascript
// Emergency SOS Dispatch
const dispatchAlert = async (coords) => {
  return await sendSOSAlert(coords);
};
\`\`\`

Visit [Official Helpline](https://112.gov.in) for details.
Unsafe link: [Malicious Link](javascript:alert('xss'))
`;

function testRender() {
  console.log('--- TESTING REACT-MARKDOWN RENDERING ---');

  // Test 1: Sample Safety Tips
  const output1 = renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      { remarkPlugins: [remarkGfm] },
      sampleResponse
    )
  );

  console.log('\n[TEST 1] Sample Response Output:');
  console.log(output1);

  if (!output1.includes('<h1>Personal Safety Tips</h1>')) {
    throw new Error('H1 heading failed to render properly!');
  }
  if (!output1.includes('<strong>Stay alert and trust your instincts.</strong>')) {
    throw new Error('Bold text failed to render properly!');
  }
  if (!output1.includes('<ul>') || !output1.includes('<li>Keep your phone charged.</li>')) {
    throw new Error('Unordered list failed to render properly!');
  }
  if (!output1.includes('<h2>During an Emergency</h2>')) {
    throw new Error('H2 heading failed to render properly!');
  }
  if (!output1.includes('<ol>') || !output1.includes('<li>Use the SOS feature when necessary.</li>')) {
    throw new Error('Numbered list failed to render properly!');
  }

  console.log('✓ Test 1 Passed! Headings, bold, bullet points, and numbered lists verified.');

  // Test 2: Tables, code blocks, links
  const output2 = renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        components: {
          a: ({ node, href, children, ...props }) => {
            const isSafe = href && (href.startsWith('http://') || href.startsWith('https://'));
            if (!isSafe) {
              return React.createElement('span', null, children);
            }
            return React.createElement('a', { href, target: '_blank', rel: 'noopener noreferrer' }, children);
          }
        }
      },
      tableAndCodeSample
    )
  );

  console.log('\n[TEST 2] Table, Code, and Link Output:');
  console.log(output2);

  if (!output2.includes('<table') || !output2.includes('Service')) {
    throw new Error('Table failed to render properly!');
  }
  if (!output2.includes('<code>navigator.geolocation.getCurrentPosition()</code>')) {
    throw new Error('Inline code failed to render properly!');
  }
  if (!output2.includes('<pre>')) {
    throw new Error('Fenced code block failed to render properly!');
  }
  if (!output2.includes('href="https://112.gov.in"')) {
    throw new Error('Safe HTTPS link failed to render!');
  }
  if (output2.includes('href="javascript:')) {
    throw new Error('Unsafe javascript: link was not blocked!');
  }

  console.log('✓ Test 2 Passed! Tables, code blocks, and safe URL sanitization verified.');

  console.log('\n=== ALL REACT-MARKDOWN TESTS PASSED SUCCESSFULLY ===\n');
}

testRender();
