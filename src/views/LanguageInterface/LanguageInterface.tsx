import classNames from 'classnames';
import styles from './LanguageInterface.module.scss';
import { useRef, useState } from 'react';
import { useThinAirClient } from '../../clients/ThinAirClient/useThinAirClient';
import { AutocompleteInterfaceCommand } from '../../clients/ThinAirClient/commands/ai/AutocompleteInterfaceCommand';
import { NodeComponentIndex } from '../../NodeComponentIndex';
import { useArrowKeyNavigation } from './useArrowKeyNavigation';


export type NodeOption = {
    type: keyof typeof NodeComponentIndex
    typeDisplayName: string
    typeDisplayIcon: string
}
export const LanguageInterface = ({

}: {
    
}) => {
    // State
    const [query, setQuery] = useState('');
    const [isAutoCompleting, setIsAutoCompleting] = useState(false)
    
    const [options, setOptions] = useState<Array<NodeOption>>((Object.keys(NodeComponentIndex) as Array<keyof typeof NodeComponentIndex>).map((key) => {
        return {
            type: key,
            typeDisplayName: NodeComponentIndex[key].typeDisplayName,
            typeDisplayIcon: NodeComponentIndex[key].typeDisplayIcon
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
        ).keys as Array<keyof typeof NodeComponentIndex>)
        .filter(key=>Object.keys(NodeComponentIndex).includes(key))
        .map((key) => {
            return {
                type: key,
                typeDisplayName: NodeComponentIndex[key].typeDisplayName,
                typeDisplayIcon: NodeComponentIndex[key].typeDisplayIcon
            }
        }))
        setIsAutoCompleting(false)
    }
    // Refs
    const autocompleteTimerRef = useRef<NodeJS.Timeout | null>(null)
    const searchbarInputRef = useRef<HTMLInputElement>(null)
    // Effects
    useArrowKeyNavigation(searchbarInputRef, options, selectedOptionIndex, setSelectedOptionIndex )
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
            <div className={classNames(styles.results)}>
                <span className={classNames(styles.title)}>Tools</span>
                {options.map((option, index) => (
                    <div key={option.type} className={classNames(styles.resultRow, {
                        [styles.selected]: index === selectedOptionIndex
                    })}>
                        <img src={option.typeDisplayIcon} alt="result" />
                        <span>{option.typeDisplayName}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

