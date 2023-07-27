import classNames from 'classnames';
import styles from './LanguageInterface.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useThinAirClient } from '../../clients/ThinAirClient/useThinAirClient';
import { AutocompleteInterfaceCommand } from '../../clients/ThinAirClient/commands/ai/AutocompleteInterfaceCommand';
import { useArrowKeyNavigation } from './useArrowKeyNavigation';
import { ColorBar } from './ColorBar';
import { UserCreatedNodeIndex } from '../../UserCreatedNodeIndex';


export type NodeOption = {
    key: keyof typeof UserCreatedNodeIndex
    displayName: string
    displayIcon: string
}
export const LanguageInterface = ({

}: {
    
}) => {
    // State
    const [query, setQuery] = useState('');
    const [isAutoCompleting, setIsAutoCompleting] = useState(false)
    
    const [options, setOptions] = useState<Array<NodeOption>>((Object.keys(UserCreatedNodeIndex) as Array<keyof typeof UserCreatedNodeIndex>).map((key) => {
        return {
            key,
            displayName: UserCreatedNodeIndex[key].displayName,
            displayIcon: UserCreatedNodeIndex[key].displayIcon
        }
    }))
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1) // -1 is searchbar
    // Updater Function
    const updateSuggestionsList = async (query: string) => {
        setIsAutoCompleting(true)
        // NOTE: You need to get rid of the filter. I just did this because TextBox and Search aren't implemented yet but the backend is returning them.
        setOptions((JSON.parse(
            (await thinAirClient.send(new AutocompleteInterfaceCommand({
                query
            })))
            .results.function_call.arguments
        ).keys as Array<keyof typeof UserCreatedNodeIndex>)
        .filter(key=>Object.keys(UserCreatedNodeIndex).includes(key))
        .map((key) => {
            return {
                key,
                displayName: UserCreatedNodeIndex[key].displayName,
                displayIcon: UserCreatedNodeIndex[key].displayIcon
            }
        }))
        setIsAutoCompleting(false)
    }
    // Refs
    const autocompleteTimerRef = useRef<NodeJS.Timeout | null>(null)
    const searchbarInputRef = useRef<HTMLInputElement>(null)
    const toolsMapRef = options.map(() => useRef<HTMLDivElement>(null))
    // Effects
    useArrowKeyNavigation(searchbarInputRef, options, selectedOptionIndex, setSelectedOptionIndex )
    useEffect(() => {
        toolsMapRef[selectedOptionIndex]?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        })
    }, [selectedOptionIndex])
    // Clients
    const thinAirClient = useThinAirClient()
    return (
        <div className={classNames(styles.languageInterface)}>
            <div className={classNames(styles.searchbar)}>
                <img className={classNames(styles.logo)} src="/logos/thinair-white.svg" alt="search" />
                <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        await updateSuggestionsList(query)
                    }}
                >
                    <input 
                        ref={searchbarInputRef}
                        value={query}
                        onChange={async (event) => {
                            setQuery(event.target.value)
                            clearTimeout(autocompleteTimerRef.current!)
                            autocompleteTimerRef.current = setTimeout(async () => {
                                await updateSuggestionsList(event.target.value)
                            }, 300)
                        }}
                        onFocus={() => {
                            setSelectedOptionIndex(-1)
                        }}
                        placeholder='Need something?'
                        autoFocus
                    />
                </form>
                <span className={classNames(styles.loadingSpinner)} style={{
                    display: isAutoCompleting ? 'block' : 'none'
                }}/>
            </div>
            <ColorBar visible={selectedOptionIndex === -1} />
            <div className={classNames(styles.results)}>
                <span>Tools</span>
                {options.map((option, index) => (
                    <div key={option.key}
                        ref={toolsMapRef[index]}
                    >
                        <div>
                            <div className={classNames({
                                [styles.selected]: index === selectedOptionIndex
                            })}>
                                <img src={option.displayIcon} alt="result" />
                                <span>{option.displayName}</span>
                            </div>
                            <ColorBar visible={index === selectedOptionIndex}/>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}

