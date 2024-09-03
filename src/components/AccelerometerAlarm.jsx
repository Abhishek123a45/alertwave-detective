import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { AlertCircle, Activity } from 'lucide-react';

const AccelerometerAlarm = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensitivity, setSensitivity] = useState(10);
  const [movement, setMovement] = useState(0);

  useEffect(() => {
    if (isMonitoring) {
      window.addEventListener('devicemotion', handleMotion);
    } else {
      window.removeEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isMonitoring, sensitivity]);

  const handleMotion = (event) => {
    const { accelerationIncludingGravity } = event;
    const currentMovement = Math.sqrt(
      accelerationIncludingGravity.x ** 2 +
      accelerationIncludingGravity.y ** 2 +
      accelerationIncludingGravity.z ** 2
    );
    setMovement(currentMovement);
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Accelerometer Monitor</h1>
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
              <Activity className="mr-2 h-4 w-4" /> Start Monitoring
            </>
          )}
        </Button>
      </div>
      {isMonitoring && (
        <div className="mt-6">
          <p className="text-lg font-semibold">Current Movement: {movement.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default AccelerometerAlarm;