import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import React, { useMemo, useState } from 'react';
import { Button, CardContent, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { TextArea } from './components/TextArea/TextArea';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ReactConfetti from 'react-confetti';

import './App.css';


interface FormValue {
    tower: string;
    towerFloor: string;
    meetingRoom: string;
    comment: string;
    date: Dayjs | null;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
}

const defaultValue: FormValue = {
    tower: '',
    towerFloor: '',
    meetingRoom: '',
    date: null,
    startTime: null,
    endTime: null,
    comment: '',
};

function App() {

    const [formValue, setFormValue] = useState<FormValue>(defaultValue);

    /**
     *  MUI x-date-pickers хотят под себя отдельный стейт. Работая с полем объекта выдают ошибку
     *  На самом деле я бы воспользовался чем-то таким
     *  https://www.npmjs.com/package/react-final-form
     *
     *  Но в ТЗ сказано "можно пользоваться готовыми библиотеками компонентов"
     *  Так что лучше сделаю на стейтах)
     */
    const [date, setDate] = React.useState<Dayjs | null>(dayjs(null));
    const [startTime, setStartTime] = React.useState<Dayjs | null>(dayjs(null));
    const [endTime, setEndTime] = React.useState<Dayjs | null>(null);

    /**
     * В слушатели события по типу onChange конечно лучше передавать функции с константной ссылкой,
     * но мне сейчас проще сделать шаблонную.
     * И useCallback тут не спасет, поскольку в шаблоне всё равно передаются стрелочные функции, каждый раз с новыми ссылками
     * Чтобы было совсем хорошо, либо делать под каждое поле свою функцию и заворачивать в useCallback,
     * либо опять же пользоваться более комплексными решения для работы с формами
     */
    const updateFormField = <T extends keyof FormValue>(
        field: T,
        value: FormValue[T],
    ) => {
        setFormValue(prev => ({
            ...prev,
            [field]: value,
        }));
    }

    const towers = useMemo(() => ['Башня А', 'Башня Б'], []);

    const floors = useMemo(() => {
        return Array.from({ length: 25 }, (_, i) => (i + 3).toString());
    }, [])

    const meetingRooms = useMemo(() => {
        return Array.from({ length: 10 }, (_, i) => ({
            number: (i + 1).toString(),
            name: `Переговока №${i + 1}`,
        }));
    }, [])

    const [confetti, setConfetti] = useState(false);

    const submitForm = () => {
        setConfetti(prev => !prev);

        console.log({
            ...formValue,
            date: date?.toJSON(),
            startTime: `${startTime?.hour()}:${startTime?.minute()}`,
            endTime: `${endTime?.hour()}:${endTime?.minute()}`,
        });
    }

    const clearForm = () => {
        setFormValue(defaultValue);
        setDate(null);
        setStartTime(null);
        setEndTime(null);
    }

    return (
        <>
            { confetti && <ReactConfetti /> }

            <Card
                variant="outlined"
                style={{ width: '600px' }}
            >
                <CardContent>
                    <Typography variant="h5" component="div" className="form-header">
                        Форма бронирования переговорки!
                    </Typography>
                    <div className="controls-wrapper">
                        <FormControl fullWidth>
                            <InputLabel id="tower-label">Выберите башню</InputLabel>
                            <Select
                                labelId="tower-label"
                                label="Выберите башню"
                                value={formValue.tower}
                                onChange={e => updateFormField('tower', e.target.value)}
                            >
                                {
                                    towers.map(tower => (
                                        <MenuItem
                                            key={tower}
                                            value={tower}
                                        >{tower}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="tower-floor-label">Выберите этаж</InputLabel>
                            <Select
                                labelId="tower-floor-label"
                                label="Выберите башню"
                                onChange={e => updateFormField('towerFloor', e.target.value)}
                                value={formValue.towerFloor}
                                name="towerFloor"
                            >
                                {
                                    floors.map(floorNumber => (
                                        <MenuItem
                                            key={floorNumber}
                                            value={floorNumber}
                                        >{floorNumber}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="meeting-room-label">Выберите переговорку</InputLabel>
                            <Select
                                labelId="meeting-room-label"
                                label="Выберите башню"
                                onChange={e => updateFormField('meetingRoom', e.target.value)}
                                value={formValue.meetingRoom}
                            >
                                {
                                    meetingRooms.map(room => (
                                        <MenuItem
                                            key={room.number}
                                            value={room.number}
                                        >{room.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>


                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                        >
                            <DatePicker
                                label="Выберите день"
                                value={date}
                                onChange={setDate}
                            />

                            <div className="time-container">
                                <TimePicker
                                    ampm={false}
                                    label="Время начала"
                                    value={startTime}
                                    onChange={setStartTime}
                                />

                                <TimePicker
                                    ampm={false}
                                    label="Время окончания"
                                    value={endTime}
                                    onChange={setEndTime}
                                />
                            </div>
                        </LocalizationProvider>


                        <TextArea
                            multiline
                            placeholder="Введите комментарий"
                            className="comment"
                            value={formValue.comment}
                            onChange={e => updateFormField('comment', e.target.value)}
                        />
                    </div>

                    <div className="actions-wrapper">
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={clearForm}
                        >
                            Очистить
                        </Button>

                        <Button
                            variant="contained"
                            color="success"
                            onClick={submitForm}
                        >
                            Отправить
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default App;
