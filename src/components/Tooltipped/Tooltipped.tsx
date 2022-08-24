import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from '@material-tailwind/react'
import React from 'react'

interface TooltippedProps {
	content: any
	children?: any
	placement?: any
}

const Tooltipped: React.FC<TooltippedProps> = ({ children, content, placement }) => (
	<>
		<Tooltip
			id={Math.random().toString()}
			content={content}
			placement={placement}
			offset={10}
			className='max-w-xs border border-primary-300 bg-primary-100 p-2 text-center text-text-100'
		>
			{children || (
				<span>
					<FontAwesomeIcon icon={faQuestionCircle} className='text-text-100 duration-200 hover:text-text-400' />
				</span>
			)}
		</Tooltip>
	</>
)

export default Tooltipped
export type { TooltippedProps }

