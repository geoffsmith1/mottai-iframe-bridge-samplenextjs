'use client'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

// const iframe = require('mottai-iframe-bridge').default;
import { default as iframe } from 'mottai-iframe-bridge-flexa';

export default function Main() {
  const [ticker, setTicker] = useState('BHP');
  const [exchange, setExchange] = useState('ASX');
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    iframe.init();
    return () => {
    };
  }, []);
  return (
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <div className="row"><span>Symbol:</span><input value={ticker} onChange={(e) => setTicker(e.target.value)} /></div>
          <div className="row"><span>Exchange:</span><input value={exchange} onChange={(e) => setExchange(e.target.value)} /></div>
          <button onClick={() => {
            const fit = window[iframe.xApiAttributeName];
            if (fit) {
              fit.sendCommand({ type: 'change_instrument', params: { instrument: { symbol: ticker, exchange } } });
            }
          }}>Change Instrument</button>
          <button onClick={() => {
            const fit = window[iframe.xApiAttributeName];
            if (fit) {
              fit.sendCommand({ type: 'popup_neworder', params: { side: 'buy', instrument: { symbol: ticker, exchange }, quantity: 1000, price: 100.00}})
            }
          }}>Popup Buy Ticket</button>
          <button onClick={() => {
            const fit = window[iframe.xApiAttributeName];
            if (fit) {
              fit.sendCommand({ type: 'popup_chart', params: { instrument: { symbol: ticker, exchange }}})
            }
          }}>Popup Chart</button>
          <button onClick={() => {
            const fit = window[iframe.xApiAttributeName];
            if (fit) {
              setError(null);
              fit.sendCommandWithResult(
                  { /*id: 'position', subscribe: true,*/ type: 'position', params: { instrument: { symbol: ticker, exchange }}},
                  true,
                  (result) => {
                    if (result.type === 'error') {
                      setError(result.data.message);
                    } else {
                      setPosition(result.data);
                    }
                  },
                  'position',
              )
            }
          }}>Subscribe to Position</button>
          <div className="row"><span>Position:</span><span>{position?.length ? `${position[0].RISK_PO_SignedQty} @${position[0].RISK_PO_OpenAvgPx}` : 'N/A'}</span></div>
          {
              error && <div className="error">{error}</div>
          }

        </main>

        <footer>
          <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
          </a>
        </footer>

        <style jsx>{`
        input {
          width: 80px;
        }
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 2em 5.5em;

        }
        .row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

        <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
      </div>
  );
}
