document.addEventListener('DOMContentLoaded', () => {
    const task = document.querySelector('.task');
    const dropAreaList = document.querySelectorAll('.droppable-area');
    const answersList = document.querySelector('.task__answers');
    const answers = answersList.querySelectorAll('.answer');
    const checkButton = document.querySelector('.task__button--check');
    const result = document.querySelector('.task__result');

    dropAreaList.forEach((dropArea) => {
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault()
            dropArea.classList.add('droppable-area--active')
        })
        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('droppable-area--active')
        })

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault()
            const alreadyPlacedAnswer = dropArea.querySelector('.answer');
            if (alreadyPlacedAnswer) {
                answersList.appendChild(alreadyPlacedAnswer);
            }
            dropArea.appendChild(selectedAnswer);
            selectedAnswer.classList.add('answer--dropped');
            dropArea.classList.remove('droppable-area--active');
            toggleCheckButton();
        })
    })

    let selectedAnswer = null;
    answers.forEach((answer) => {
        answer.addEventListener('dragstart', () => {
            answer.classList.add('answer--dragged');
            selectedAnswer = answer;
        })

        answer.addEventListener('dragend', () => {
            answer.classList.remove('answer--dragged');
            selectedAnswer = null;
        });
    })

    const toggleCheckButton = () => {
        const answersCount = answersList.querySelectorAll('.answer').length
        if(answersCount === 0) {
            task.classList.add('task--filled');
        }
        else {
            task.classList.remove('task--filled')
        }
    }

    // Check answers
    checkButton.addEventListener('click', () => {
        task.classList.add('task--checking');
        answers.forEach((answer) => {
            const answerKey = answer.dataset.key;
            const areaId = answer.closest('.droppable-area').dataset.areaId;
            if (areaId === answerKey) {
                answer.classList.add('answer--right');
            } else {
                answer.classList.add('answer--wrong');
            }
        })
        const wrongAnswersList = document.querySelectorAll('.answer--wrong');
        if(wrongAnswersList.length) {
            result.innerHTML = result.dataset.wrongText;
            setTimeout(() => {
                checkButton.innerHTML = checkButton.dataset.retryText;
                wrongAnswersList.forEach((answer) => {
                    answer.classList.remove('answer--wrong', 'answer--dropped');
                    answersList.appendChild(answer);
                })
                toggleCheckButton();
                task.classList.remove('task--checking');
            }, 2000)
        }
        else {
            result.innerHTML = result.dataset.rightText;
            task.classList.remove('task--filled');
            task.classList.add('task--completed');
        }
    })
})