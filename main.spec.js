// import { hello } from './main.js';

// describe('Hello World', () => {
//   test('Say Hi!', () => {
//     expect(hello()).toEqual('Hello, World!');
//   });
// });


import { fireEvent, getByText, getByDisplayValue } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import { isMainThread } from 'worker_threads'
import { hasUncaughtExceptionCaptureCallback } from 'process'
import { setTimeout } from 'timers'

const html = fs.readFileSync(path.resolve('html', './index.html'), 'utf8');
let dom 
let container
describe('index.html', () => {
    beforeEach((done) => {
        // Constructing a new JSDOM with this option is the key
        // to getting the code in the script tag to execute.
        // This is indeed dangerous and should only be done with trusted content.
        // https://github.com/jsdom/jsdom#executing-scripts
        let options = {
            resources: "usable",
            runScripts: 'dangerously'
        }
    
        JSDOM.fromFile('./html/index.html', options).then((dom) => {
            setTimeout(() => {
                container = dom.window.document.body
                done();
            }, 500);
        })
      })

    it('flips a card and checks that timer started', (done) => {
        const button = container.querySelectorAll('article')[0].children[0]
        expect(button).not.toBeNull();
        fireEvent.click(button)

        setTimeout(() => {
            expect(container.querySelector('h2.time').innerHTML).not.toBe('0.0')
            done()
        }, 1000);
    })

    it('finds a match, clicks both cards and tries to click cards again without success', (done) => {
        const match = container.querySelectorAll('[data-pair_handler="1"]');
        fireEvent.click(match[0].children[0]);
        fireEvent.click(match[1].children[0]);

        setTimeout(() => {
            expect(match[0].getAttribute('data-face')).toBe('frozen')
            expect(match[1].getAttribute('data-face')).toBe('frozen')
            fireEvent.click(match[0].children[0]);
            fireEvent.click(match[1].children[0]);
            expect(match[0].getAttribute('data-face')).toBe('frozen')
            expect(match[1].getAttribute('data-face')).toBe('frozen')
            done();
        }, 750);
    })
})
