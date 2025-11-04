import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Logo from './ui/Logo';
import Button from './ui/Button';

const LockScreen: React.FC = () => {
  const { pin, setPin, login } = useApp();
  const [isSettingPin, setIsSettingPin] = useState(!pin);
  const [currentPin, setCurrentPin] = useState<string[]>(Array(6).fill(''));
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(6).fill(''));
  const [isConfirming, setIsConfirming] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    index: number, 
    pinType: 'current' | 'confirm' | '2fa'
  ) => {
    const { value } = e.target;
    let newPin;

    switch(pinType) {
        case 'current': newPin = [...currentPin]; break;
        case 'confirm': newPin = [...confirmPin]; break;
        case '2fa': newPin = [...twoFactorCode]; break;
    }
    
    if (/^[0-9]$/.test(value) || value === '') {
      newPin[index] = value;
      switch(pinType) {
        case 'current': setCurrentPin(newPin); break;
        case 'confirm': setConfirmPin(newPin); break;
        case '2fa': setTwoFactorCode(newPin); break;
      }
      
      const nextIndex = (pinType === 'current' ? 0 : pinType === 'confirm' ? 6 : 12) + index + 1;
      if (value !== '' && index < 5) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, pinType: 'current' | 'confirm' | '2fa') => {
    const pinValue = pinType === 'current' ? currentPin : pinType === 'confirm' ? confirmPin : twoFactorCode;
     const baseIndex = (pinType === 'current' ? 0 : pinType === 'confirm' ? 6 : 12);

    if (e.key === 'Backspace' && pinValue[index] === '' && index > 0) {
      inputRefs.current[baseIndex + index - 1]?.focus();
    }
  };
  
  const handlePinSubmit = () => {
    setError('');
    const enteredPin = currentPin.join('');
    if (enteredPin.length !== 6) {
      setError('O PIN deve ter 6 dígitos.');
      return;
    }

    if (isSettingPin) {
      if (!isConfirming) {
        setIsConfirming(true);
        setTimeout(() => inputRefs.current[6]?.focus(), 100);
      } else {
        const confirmedPin = confirmPin.join('');
        if (enteredPin === confirmedPin) {
          setPin(enteredPin);
          // After setting pin, user is "logged in" for the first time.
        } else {
          setError('Os PINs não coincidem.');
          setCurrentPin(Array(6).fill(''));
          setConfirmPin(Array(6).fill(''));
          setIsConfirming(false);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
      }
    } else {
       setShow2FA(true); // Always show 2FA on login attempt
       setTimeout(() => inputRefs.current[12]?.focus(), 100);
    }
  };

  const handle2FASubmit = () => {
    setError('');
    const enteredPin = currentPin.join('');
    const entered2FACode = twoFactorCode.join('');

    if (entered2FACode !== '123456') {
        setError('Código 2FA incorreto.');
        setTwoFactorCode(Array(6).fill(''));
        inputRefs.current[12]?.focus();
        return;
    }

    if (!login(enteredPin)) {
        setError('PIN incorreto. Tente novamente.');
        setCurrentPin(Array(6).fill(''));
        setTwoFactorCode(Array(6).fill(''));
        setShow2FA(false);
        inputRefs.current[0]?.focus();
    }
    // Login successful is handled by context
  }

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const PinInputs: React.FC<{pin: string[], pinType: 'current' | 'confirm' | '2fa'}> = ({pin, pinType}) => {
    const startIndex = pinType === 'current' ? 0 : pinType === 'confirm' ? 6 : 12;
    return (
        <div className="flex justify-center space-x-2 my-4">
        {pin.map((digit, index) => (
            <input
            key={startIndex + index}
            // FIX: The ref callback should not return a value. Using curly braces ensures an implicit return of undefined.
            ref={(el) => { inputRefs.current[startIndex + index] = el; }}
            type="password"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(e, index, pinType)}
            onKeyDown={(e) => handleKeyDown(e, index, pinType)}
            className="w-12 h-14 bg-[#0a101f] border-2 border-blue-800/70 rounded-md text-center text-2xl font-bold text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
        ))}
        </div>
    );
  }

  if (show2FA) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a101f] to-[#10182c] p-4">
            <div className="w-full max-w-md text-center">
                 <Logo className="h-20 w-20 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-2">Autenticação de Dois Fatores</h1>
                <p className="text-blue-300 mb-8">Use o código do seu app (Simulado: 123456)</p>
                <PinInputs pin={twoFactorCode} pinType="2fa" />
                 {error && <p className="text-red-400 mt-4">{error}</p>}
                <Button onClick={handle2FASubmit} className="w-full mt-8">
                    Verificar
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a101f] to-[#10182c] p-4">
      <div className="w-full max-w-md text-center">
        <Logo className="h-20 w-20 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-2">{isSettingPin ? "Crie seu PIN de Segurança" : "Bem-vindo ao M.A.R.K."}</h1>
        <p className="text-blue-300 mb-8">{isSettingPin ? "Este PIN protegerá seus dados." : "Digite seu PIN para continuar."}</p>
        
        {!isConfirming && <PinInputs pin={currentPin} pinType="current" />}
        {isConfirming && (
          <div>
            <p className="text-blue-300 mb-4">Confirme seu PIN</p>
            <PinInputs pin={confirmPin} pinType="confirm" />
          </div>
        )}

        {error && <p className="text-red-400 mt-4">{error}</p>}
        
        <Button onClick={handlePinSubmit} className="w-full mt-8">
          {isSettingPin ? (isConfirming ? 'Salvar PIN' : 'Confirmar') : 'Avançar'}
        </Button>
      </div>
    </div>
  );
};

export default LockScreen;
