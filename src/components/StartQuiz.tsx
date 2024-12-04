import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setPrioritiseIncorrect, selectPrioritiseIncorrect, selectSubject, selectSubjectCategories, selectSubjects, setCategory, setNumberOfQuestions, setStartQuiz, setSubject } from '../features/questions/quizSlice';
import type { NumberOfQuestions } from '../types/quiz';
import { selectStyles } from '../stylesreact/styles';
import { CheckBox } from './CheckBox';


const selectQuestionCount = [5,10,20,30,40,50];

export default function StartQuiz() {
    const dispatch = useAppDispatch();
    const selectCat = (item: { label: string, value: string }) => {
        dispatch(setCategory({
            id: item.value,
            name: item.label,
        }))
    }
    const selectSub = (item: { label: string, value: string }) => {
        dispatch(setSubject({
            id: item.value,
            name: item.label,
        }))
    }
    const setNumQuestions = (item: { label: string, value: number }) => {
        dispatch(setNumberOfQuestions(Number(item.value) as NumberOfQuestions));
    }
    const togglePrioritiseIncorrect = () => {
        dispatch(setPrioritiseIncorrect(!prioritiseIncorrect));
    }
    const subjectCategories = useAppSelector(selectSubjectCategories);
    const subjects = useAppSelector(selectSubjects);
    const subject = useAppSelector(selectSubject);
    const prioritiseIncorrect = useAppSelector(selectPrioritiseIncorrect);
    const startQuiz = () => {
        dispatch(setStartQuiz());

    }
    const subjectDefault = { value: subject.id, label: subject.name };

    return (
        <div className='start-quiz'>
            <div className='select-list'>
                <div>
                    {
                        subjects && subjects.length > 0 && <Select
                            styles={selectStyles}
                            options={subjects.map(subject => ({ value: subject.id, label: subject.name }))}
                            defaultValue={subjectDefault} // Set only when subjectCategories has data
                            onChange={(item) => item && selectSub(item)}
                        />
                    }
                </div>
                <div key={subject.id}>
                    {
                        subjectCategories && subjectCategories.length > 0 && <Select
                            styles={selectStyles}
                            options={subjectCategories.map(category => ({ value: category.id, label: category.name }))}
                            defaultValue={{ value: subjectCategories[0]?.id, label: subjectCategories[0]?.name }} // Set only when subjectCategories has data
                            onChange={(item) => item && selectCat(item)}
                        />
                    }
                </div>
                <div>
                    {
                        <Select
                            styles={selectStyles}
                            options={selectQuestionCount.map(option => ({ value: option, label: String(option) }))}
                            defaultValue={{ value: selectQuestionCount[1], label: String(selectQuestionCount[1]) }} // Set only when subjectCategories has data}
                            onChange={(item) => item && setNumQuestions(item)}
                        />
                    }
                </div>
            </div>
            <div className='checkbox-container'>
                <CheckBox
                    label="Prioritise Incorrect past questions"
                    defaultValue={prioritiseIncorrect}
                    onChange={togglePrioritiseIncorrect}
                />
            </div>
            <div className='start-quiz-button'>
                {
                    subjectCategories && subjectCategories.length > 0 && <button onClick={startQuiz}>Start Quiz</button>
                }
            </div>

        </div>
    );
}