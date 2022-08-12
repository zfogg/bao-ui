import React from 'react'
import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import Footer from '@/components/Footer'

interface PageProps {
	children: any
}

const Page: React.FC<PropsWithChildren<PageProps>> = ({ children }) => (
	<div className="container mx-auto flex absolute top-18 left-0 w-[calc(100vh-theme('topBarSize')px]">
		<StyledPageWrapper>
			<StyledMain>{children}</StyledMain>
			<Footer />
		</StyledPageWrapper>
	</div>
)

const StyledPageContainer = styled.div`
	background-image: ${props => props.theme.backgroundOverlay.default};
	display: table;
	position: absolute;
	top: ${props => props.theme.topBarSize}px;
	left: 0;
	height: calc(100vh - ${props => props.theme.topBarSize}px);
	width: 100%; ;
`

const StyledPageWrapper = styled.div`
	display: table-cell;
	vertical-align: middle;
	min-height: calc(100vh - ${props => props.theme.topBarSize}px);
	background-size: cover;
	background-repeat: no-repeat;
	top: 0;
	left: 0;
`

const StyledMain = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	min-height: calc(100vh - 240px);
`

export default Page
