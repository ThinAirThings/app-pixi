import { Dispatch, SetStateAction, useEffect } from "react"
import { fromEvent } from "rxjs"


export const useArrowKeyNavigation = (
    options: Array<any>,
    setSelectedOptionIndex: Dispatch<SetStateAction<number>>,
) => {
    useEffect(() => {
        const subscription = fromEvent<KeyboardEvent>(window, 'keydown')
        .subscribe((event) => {

            if (event.key === 'ArrowUp') {
                setSelectedOptionIndex(prev => (prev > 0 ? prev - 1 : options.length - 1))
            }
            if (event.key === 'ArrowDown') {
                setSelectedOptionIndex(prev => (prev < options.length - 1 ? prev + 1 : 0))
            }
        })
        return () => subscription?.unsubscribe()
    }, [])
}