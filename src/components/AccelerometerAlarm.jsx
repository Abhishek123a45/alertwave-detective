import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Activity } from 'lucide-react';
import LineChart from './LineChart';
import AlarmClock from './AlarmClock';

const AccelerometerAlarm = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensitivity, setSensitivity] = useState(10);
  const [movement, setMovement] = useState({ x: 0, y: 0, z: 0 });
  const [data, setData] = useState([]);
  const [offsetTime, setOffsetTime] = useState(5);
  const [lastMovement, setLastMovement] = useState({ x: 0, y: 0, z: 0 });
  const [alarmTriggered, setAlarmTriggered] = useState(false);

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
    const newMovement = {
      x: accelerationIncludingGravity.x || 0,
      y: accelerationIncludingGravity.y || 0,
      z: accelerationIncludingGravity.z || 0
    };
    setMovement(newMovement);
    setData(prevData => [...prevData.slice(-50), { ...newMovement, time: new Date().getTime() }]);

    // Check for significant change in acceleration
    const change = {
      x: Math.abs(newMovement.x - lastMovement.x),
      y: Math.abs(newMovement.y - lastMovement.y),
      z: Math.abs(newMovement.z - lastMovement.z)
    };

    if ((change.x > 2 || change.y > 2 || change.z > 2) && !alarmTriggered) {
      setAlarmTriggered(true);
      triggerAlarm();
    }

    setLastMovement(newMovement);
  };

  const triggerAlarm = () => {
    // This function will be called when significant movement is detected
    console.log("Significant movement detected! Setting alarm...");
    // The AlarmClock component will handle setting the actual alarm
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      setData([]);
      setAlarmTriggered(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Accelerometer Monitor</h1>
      <div className="mb-6 w-full max-w-md">
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
      <div className="mb-6 w-full max-w-md">
        <label htmlFor="offsetTime" className="block text-sm font-medium text-gray-700 mb-1">
          Offset Time (minutes):
        </label>
        <Input
          type="number"
          id="offsetTime"
          value={offsetTime}
          onChange={(e) => setOffsetTime(Number(e.target.value))}
          min="1"
          className="w-full"
        />
      </div>
      <div className="space-y-4 w-full max-w-md">
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
        <div className="mt-6 w-full max-w-2xl">
          <p className="text-lg font-semibold mb-2">Current Movement:</p>
          <p>X: {movement.x.toFixed(2)}</p>
          <p>Y: {movement.y.toFixed(2)}</p>
          <p>Z: {movement.z.toFixed(2)}</p>
          <LineChart data={data} />
        </div>
      )}
      <AlarmClock initialOffsetTime={offsetTime} onAlarmTrigger={triggerAlarm} />
    </div>
  );
};

export default AccelerometerAlarm;