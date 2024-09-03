import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { AlertCircle, Activity } from 'lucide-react';
import LineChart from './LineChart';
import { toast } from "sonner"

const AccelerometerAlarm = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensitivity, setSensitivity] = useState(10);
  const [movement, setMovement] = useState({ x: 0, y: 0, z: 0 });
  const [data, setData] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [lastSignificantMovement, setLastSignificantMovement] = useState(null);

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

    const magnitude = Math.sqrt(newMovement.x ** 2 + newMovement.y ** 2 + newMovement.z ** 2);
    const isSignificantMovement = magnitude > sensitivity / 10;

    if (isSignificantMovement && !isMoving) {
      setIsMoving(true);
      toast.info("Movement started");
    } else if (!isSignificantMovement && isMoving) {
      const currentTime = new Date().getTime();
      if (lastSignificantMovement && (currentTime - lastSignificantMovement > 2000)) {
        setIsMoving(false);
        toast.info("Movement ended");
      }
    }

    if (isSignificantMovement) {
      setLastSignificantMovement(new Date().getTime());
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      setData([]);
      setIsMoving(false);
      setLastSignificantMovement(null);
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
    </div>
  );
};

export default AccelerometerAlarm;