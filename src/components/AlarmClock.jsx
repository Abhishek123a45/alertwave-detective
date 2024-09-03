import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAlarmSet && !isAlarmRinging) {
      const [alarmHours, alarmMinutes] = alarmTime.split(':');
      const now = new Date();
      if (now.getHours() === parseInt(alarmHours) && now.getMinutes() === parseInt(alarmMinutes)) {
        setIsAlarmRinging(true);
        if (audioRef.current) {
          audioRef.current.play();
        }
      }
    }
  }, [currentTime, alarmTime, isAlarmSet, isAlarmRinging]);

  const handleSetAlarm = () => {
    if (alarmTime) {
      setIsAlarmSet(true);
      toast.success('Alarm set successfully!');
    } else {
      toast.error('Please set a valid alarm time.');
    }
  };

  const handleStopAlarm = () => {
    setIsAlarmRinging(false);
    setIsAlarmSet(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSnooze = () => {
    handleStopAlarm();
    const snoozeTime = new Date(currentTime.getTime() + 5 * 60000);
    setAlarmTime(`${snoozeTime.getHours().toString().padStart(2, '0')}:${snoozeTime.getMinutes().toString().padStart(2, '0')}`);
    setIsAlarmSet(true);
    toast.info('Alarm snoozed for 5 minutes.');
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedAudio(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Alarm Clock</h2>
      <div className="text-4xl font-bold">
        {currentTime.toLocaleTimeString()}
      </div>
      <Input
        type="time"
        value={alarmTime}
        onChange={(e) => setAlarmTime(e.target.value)}
        className="w-full max-w-xs"
      />
      <Button onClick={handleSetAlarm} disabled={isAlarmSet}>
        <Bell className="mr-2 h-4 w-4" /> Set Alarm
      </Button>
      {isAlarmSet && (
        <p className="text-sm text-gray-600">
          Alarm set for {alarmTime}
        </p>
      )}
      {isAlarmRinging && (
        <div className="space-y-2">
          <Button onClick={handleStopAlarm} variant="destructive">
            <PauseCircle className="mr-2 h-4 w-4" /> Stop Alarm
          </Button>
          <Button onClick={handleSnooze} variant="outline">
            Snooze (5 minutes)
          </Button>
        </div>
      )}
      <div className="w-full max-w-xs">
        <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700 mb-1">
          Select Alarm Sound
        </label>
        <Input
          type="file"
          id="audio-file"
          accept="audio/*"
          onChange={handleAudioChange}
        />
      </div>
      <audio ref={audioRef} src={selectedAudio || '/default-alarm.mp3'} />
    </div>
  );
};

export default AlarmClock;