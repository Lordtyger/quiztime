import { useEffect } from 'react';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCategories, selectCategory, selectFlashCardSubjects, selectSubject, selectSubjectLoaded, setCategories, setCategory, setCurrentQuestions, setNumberOfCards, setStartFlashCards, setSubject } from "../features/flashcards/flashCardSlice";
import { useGetFlashQuery } from "../features/questions/flashCardApiSlice";
import { formatCategoryLabel } from '../helpers/misc';
import { selectStyles } from '../stylesreact/styles';
import type { NumberOfQuestions } from '../types/quiz';

const selectQuestionCount = [5,10,20,30,40,50];

export default function FlashCards() {
    const dispatch = useAppDispatch();

    // State selectors
    const categories = useAppSelector(selectCategories);
    const subjects = useAppSelector(selectFlashCardSubjects);
    const currentSubject = useAppSelector(selectSubject);
    const currentCategory = useAppSelector(selectCategory);
    const currentQuestionCount = useAppSelector(state => state.flashCards.numberOfCards);
    const hasLoaded = useAppSelector(state =>
        selectSubjectLoaded(state, currentSubject?.id || '')
    );

    // API query
    const { data, isSuccess } = useGetFlashQuery(currentSubject?.id || '', {
        skip: !currentSubject
    });

    // Set default subject if none is selected
    useEffect(() => {
        if (!currentSubject && subjects.length > 0) {
            const defaultSubject = subjects[0];
            dispatch(setSubject({ id: defaultSubject.id, name: defaultSubject.name }));
        }
    }, [currentSubject, subjects, dispatch]);

    // Update categories once subject data is loaded
    useEffect(() => {
        if (isSuccess && data && currentSubject?.id && hasLoaded) {
            dispatch(setCategories(currentSubject.id));
        }
    }, [isSuccess, data, currentSubject, hasLoaded, dispatch]);

    const handleSelectSubject = (item: { label: string; value: string }) => {
        dispatch(setSubject({ id: item.value, name: item.label }));
    };
    const handleSelectQuestionCount = (item: { label: string; value: number }) => {
        dispatch(setNumberOfCards(Number(item.value) as NumberOfQuestions));
    };
    const handleSelectCategory = (item: { label: string; value: string }) => {
        dispatch(setCategory({ id: item.value, name: item.label }));
    };
    const handleStartFlashCards = () => {
        dispatch(setCurrentQuestions())
        dispatch(setStartFlashCards());
    }

    return (
        <div className='start-quiz'>
            <div className='select-list'>
                <div>
                    {
                        currentSubject && <Select
                            styles={selectStyles}
                            options={subjects.map(category => ({ value: category.id, label: category.name }))}
                            defaultValue={{ value: currentSubject?.id, label: currentSubject?.name }} // Set only when subjectCategories has data
                            onChange={(item) => item && handleSelectSubject(item)}
                        />
                    }
                </div>
                <div>
                    {
                        categories.length && currentCategory && <Select
                            key={`my_unique_select_key__${currentSubject?.id}`}
                            styles={selectStyles}
                            options={categories.map(category => ({
                                value: category,
                                label: formatCategoryLabel(category),
                            }))}
                            value={{
                                value: currentCategory.id,
                                label: formatCategoryLabel(currentCategory.name),
                            }}
                            onChange={(item) => item && handleSelectCategory(item)}
                        />
                    }
                </div>
                <div>
                    {
                        <Select
                            styles={selectStyles}
                            options={selectQuestionCount.map(option => ({ value: option, label: String(option) }))}
                            value={{ value: currentQuestionCount, label: String(currentQuestionCount) }}
                            onChange={(item) => item && handleSelectQuestionCount(item)}
                        />
                    }
                </div>
            </div>
            <div className='start-quiz-button'><button onClick={handleStartFlashCards}>Start flash</button></div>
        </div>
    )
}