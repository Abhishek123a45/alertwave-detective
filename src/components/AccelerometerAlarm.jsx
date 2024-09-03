import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { AlertCircle, BellRing, BellOff } from 'lucide-react';

const AccelerometerAlarm = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isAlarming, setIsAlarming] = useState(false);
  const [sensitivity, setSensitivity] = useState(10);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    if (isMonitoring) {
      window.addEventListener('devicemotion', handleMotion);
    } else {
      window.removeEventListener('devicemotion', handleMotion);
      stopAlarm();
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      stopAlarm();
    };
  }, [isMonitoring, sensitivity]);

  const handleMotion = (event) => {
    const { accelerationIncludingGravity } = event;
    const movement = Math.sqrt(
      accelerationIncludingGravity.x ** 2 +
      accelerationIncludingGravity.y ** 2 +
      accelerationIncludingGravity.z ** 2
    );

    if (movement > sensitivity) {
      startAlarm();
    }
  };

  const startAlarm = () => {
    if (!isAlarming) {
      setIsAlarming(true);
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
      
      oscillatorRef.current = audioContext.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.setValueAtTime(440, audioContext.currentTime);
      
      gainNodeRef.current = audioContext.createGain();
      gainNodeRef.current.gain.setValueAtTime(0, audioContext.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);
      
      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContext.destination);
      oscillatorRef.current.start();
    }
  };

  const stopAlarm = () => {
    if (isAlarming) {
      setIsAlarming(false);
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
    }
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      setIsMonitoring(false);
      stopAlarm();
    } else {
      setIsMonitoring(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Accelerometer Alarm</h1>
      <div className="mb-6">
        <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-700 mb-1">
          Sensitivity: {sensitivity}
        </label>
        <input
          type="range"
          id="sensitivity"
          min="5"
          max="20"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="space-y-4">
        <Button
          onClick={toggleMonitoring}
          className={`w-full ${isMonitoring ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isMonitoring ? (
            <>
              <AlertCircle className="mr-2 h-4 w-4" /> Stop Monitoring
            </>
          ) : (
            <>
              <BellRing className="mr-2 h-4 w-4" /> Start Monitoring
            </>
          )}
        </Button>
        {isAlarming && (
          <Button onClick={stopAlarm} className="w-full bg-yellow-500 hover:bg-yellow-600">
            <BellOff className="mr-2 h-4 w-4" /> Silence Alarm
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccelerometerAlarm;