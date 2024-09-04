import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, PlusCircle } from 'lucide-react';

const AlarmForm = ({ newAlarmTime, onNewAlarmTimeChange, onAddAlarm, timeOffset, onTimeOffsetChange, onAddOffsetAlarm }) => {
  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="space-y-2">
        <Input
          type="time"
          value={newAlarmTime}
          onChange={(e) => onNewAlarmTimeChange(e.target.value)}
          className="w-full"
        />
        <Button onClick={onAddAlarm} className="w-full">
          <Bell className="mr-2 h-4 w-4" /> Add Alarm
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={timeOffset}
          onChange={(e) => onTimeOffsetChange(Number(e.target.value))}
          min="1"
          className="w-1/2"
          placeholder="Minutes from now"
        />
        <Button onClick={onAddOffsetAlarm} className="w-1/2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Offset Alarm
        </Button>
      </div>
    </div>
  );
};

export default AlarmForm;