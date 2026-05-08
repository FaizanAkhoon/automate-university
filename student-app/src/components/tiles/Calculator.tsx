import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, X, Delete } from 'lucide-react';

const BUTTONS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

const isOp    = b => ['÷','×','−','+'].includes(b);
const isRight = b => ['÷','×','−','+','='].includes(b);

export default function Calculator({ onClose }) {
  const [display, setDisplay] = useState('0');
  const [expr, setExpr]       = useState('');
  const [history, setHistory] = useState([]);
  const [fresh, setFresh]     = useState(false); // after = pressed, next digit clears

  const press = (btn) => {
    if (btn === 'C') {
      setDisplay('0');
      setExpr('');
      setFresh(false);
      return;
    }
    if (btn === '⌫') {
      setDisplay(d => d.length > 1 ? d.slice(0,-1) : '0');
      return;
    }
    if (btn === '±') {
      setDisplay(d => d.startsWith('-') ? d.slice(1) : d === '0' ? '0' : '-' + d);
      return;
    }
    if (btn === '%') {
      setDisplay(d => String(parseFloat(d) / 100));
      return;
    }
    if (btn === '=') {
      try {
        const raw = (expr + display)
          .replace(/÷/g, '/')
          .replace(/×/g, '*')
          .replace(/−/g, '-');
        // eslint-disable-next-line no-new-func
        const result = new Function('return ' + raw)();
        const resultStr = Number.isFinite(result) ? String(+result.toFixed(10)) : 'Error';
        setHistory(h => [`${expr}${display} = ${resultStr}`, ...h.slice(0, 9)]);
        setDisplay(resultStr);
        setExpr('');
        setFresh(true);
      } catch {
        setDisplay('Error');
        setExpr('');
      }
      return;
    }
    if (isOp(btn)) {
      setExpr(expr + display + btn);
      setFresh(true);
      return;
    }
    // Digit or dot
    if (fresh || display === '0') {
      setDisplay(btn === '.' ? '0.' : btn);
      setFresh(false);
    } else {
      if (btn === '.' && display.includes('.')) return;
      setDisplay(d => d + btn);
    }
  };

  return (
    <div className="tile-overlay" onClick={onClose}>
      <motion.div
        className="tile-modal"
        style={{ maxWidth: 380 }}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b33,#f59e0b11)', border: '1px solid #f59e0b44' }}>
              <CalcIcon size={20} color="#f59e0b" />
            </div>
            <h2 className="text-white font-bold text-xl">Calculator</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>

        {/* Display */}
        <div className="glass rounded-2xl p-4 mb-4">
          <p className="text-right text-xs mb-1 h-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>
            {expr}
          </p>
          <motion.p
            key={display}
            initial={{ y: -5, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-right font-bold text-white"
            style={{ fontSize: display.length > 10 ? '1.5rem' : '2.5rem', fontFamily: 'monospace', letterSpacing: '-1px' }}
          >
            {display}
          </motion.p>
        </div>

        {/* Buttons */}
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {BUTTONS.flat().map((btn, i) => {
            const isOp_ = isOp(btn);
            const isEq  = btn === '=';
            const isClear = btn === 'C';
            return (
              <motion.button
                key={i}
                onClick={() => press(btn)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                className="h-14 rounded-xl font-semibold text-lg flex items-center justify-center transition-all"
                style={{
                  background: isEq
                    ? 'linear-gradient(135deg,#f59e0b,#ef4444)'
                    : isOp_
                    ? 'rgba(108,99,255,0.25)'
                    : isClear
                    ? 'rgba(239,68,68,0.2)'
                    : 'rgba(255,255,255,0.07)',
                  border: isEq
                    ? 'none'
                    : isOp_
                    ? '1px solid rgba(108,99,255,0.3)'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: isOp_ ? '#a88dff' : isClear ? '#f87171' : 'white',
                  boxShadow: isEq ? '0 4px 20px rgba(245,158,11,0.3)' : 'none',
                  fontSize: btn === '⌫' ? '1.2rem' : '1.1rem',
                }}
              >
                {btn}
              </motion.button>
            );
          })}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-4 glass rounded-xl p-3">
            <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>HISTORY</p>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {history.map((h, i) => (
                <p key={i} className="text-xs font-mono text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>{h}</p>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
