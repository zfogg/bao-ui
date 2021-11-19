import Table from 'components/Table'
import Tooltipped from 'components/Tooltipped'
import { Market } from 'contexts/Markets'
import { useAccountBalances } from 'hooks/hard-synths/useBalances'
import useMarkets from 'hooks/hard-synths/useMarkets'
import { usePrice } from 'hooks/hard-synths/usePrices'
import useModal from 'hooks/useModal'
import React, { useState } from 'react'
import { FormCheck } from 'react-bootstrap'
import { MarketBorrowModal, MarketSupplyModal } from './Modals'
import {
	Flex,
	MarketContainer,
	MarketHeaderContainer,
	MarketHeaderStack,
	MarketHeader,
	MarketHeaderText,
	MarketHeaderSubText,
	MarketTableContainer,
	MarketTable,
	TableHeader,
	HeaderWrapper,
	ItemContainer,
	ItemWrapper,
	MarketHeaderWrapper,
	MarketItemContainer,
	MarketItemWrapper,
	MarketSummary,
	MarketSummaryHeader,
	OverviewTableContainer,
	BorrowLimit,
	BorrowMeter,
	BorrowMeterContainer,
	BorrowText,
	OverviewContainer,
	OverviewHeader,
} from './styles'

export const Overview: React.FC = () => {
	return (
		<OverviewContainer>
			<OverviewHeader>
				<BorrowLimit>
					Borrow Limit <Tooltipped content={`Some info here.`} />
				</BorrowLimit>
				<BorrowText>0%</BorrowText>
				<BorrowMeterContainer>
					<BorrowMeter />
				</BorrowMeterContainer>
				<BorrowText>$0</BorrowText>
			</OverviewHeader>
		</OverviewContainer>
	)
}

export const Supply: React.FC = () => {
	const [modalAsset, setModalAsset] = useState<Market>()
	const [handleSupply] = useModal(<MarketSupplyModal />)

	const balances = useAccountBalances()
	const markets = useMarkets()

	const columns = [
		{
			header: <HeaderWrapper>Asset</HeaderWrapper>,
			value: (market: Market) => {
				// underlying symbol
				const { symbol } = balances.find(
					(balance) =>
						balance.address.toLowerCase() === market.underlying.toLowerCase(),
				)
			
				return (
					<ItemWrapper>
						<img src={market.icon} />
						<p>{symbol}</p>
					</ItemWrapper>
				)
			},
		},
		{
			header: <HeaderWrapper style={{ justifyContent: 'center', textAlign: 'center' }}>APY</HeaderWrapper>,
			value: ({ supplyApy }: Market) => (
				<ItemWrapper style={{ justifyContent: 'center', textAlign: 'center' }}>
					{supplyApy ? `${supplyApy.toFixed(2)}%` : '-'}
				</ItemWrapper>
			),
		},
		{
			header: <HeaderWrapper style={{ justifyContent: 'flex-end', textAlign: 'end' }}>Wallet</HeaderWrapper>,
			value: (market: Market) => {
				// underlying balance & symbol
				const { balance, symbol } = balances.find(
					(balance) =>
						balance.address.toLowerCase() === market.underlying.toLowerCase(),
				)

				return <ItemWrapper style={{ justifyContent: 'flex-end', textAlign: 'end' }}>{`${balance.toFixed(2)} ${symbol}`}</ItemWrapper>
			}
		}
	]

	return (
		<>
			<Flex>
				<MarketContainer>
					<MarketHeaderContainer>
						<MarketHeaderStack>
							<MarketHeader>
								<Flex>
									<MarketHeaderText>Supply</MarketHeaderText>
								</Flex>
								<Flex>
									<MarketHeaderSubText>
										Earn interest on your deposits
									</MarketHeaderSubText>
								</Flex>
							</MarketHeader>
						</MarketHeaderStack>
					</MarketHeaderContainer>
					<Table columns={columns} items={markets} />
				</MarketContainer>
			</Flex>
		</>
	)
}

export const Borrow: React.FC = () => {
	const [handleBorrow] = useModal(<MarketBorrowModal />)
	const [modalAsset, setModalAsset] = useState<Market>()

	const balances = useAccountBalances()
	const markets = useMarkets()

	return (
		<>
			<Flex>
				<MarketContainer>
					<MarketHeaderContainer>
						<MarketHeaderStack>
							<MarketHeader>
								<Flex>
									<MarketHeaderText>Borrow</MarketHeaderText>
								</Flex>
								<Flex>
									<MarketHeaderSubText>
										Borrow against your supplied collateral
									</MarketHeaderSubText>
								</Flex>
							</MarketHeader>
						</MarketHeaderStack>
					</MarketHeaderContainer>
					<MarketTableContainer>
						<MarketTable>
							<TableHeader>
								<HeaderWrapper>Asset</HeaderWrapper>
								<HeaderWrapper
									style={{ justifyContent: 'center', textAlign: 'center' }}
								>
									APR
								</HeaderWrapper>
								<HeaderWrapper
									style={{ justifyContent: 'flex-end', textAlign: 'end' }}
								>
									Liquidity
								</HeaderWrapper>
							</TableHeader>
							<ItemContainer onClick={handleBorrow}>
								<ItemWrapper>
									<img src="USDC.png" />
									<p>USDC</p>
								</ItemWrapper>
								<ItemWrapper
									style={{
										justifyContent: 'center',
										textAlign: 'center',
									}}
								>
									5.00%
								</ItemWrapper>
								<ItemWrapper
									style={{
										justifyContent: 'flex-end',
										textAlign: 'end',
									}}
								>
									$1.0M
								</ItemWrapper>
							</ItemContainer>
						</MarketTable>
					</MarketTableContainer>
				</MarketContainer>
			</Flex>
		</>
	)
}

export const Supplied: React.FC = () => {

	const [handleSupply] = useModal(<MarketSupplyModal />)


	return (
		<>
			<OverviewTableContainer>
				<MarketTable>
					<TableHeader>
						<HeaderWrapper>Asset</HeaderWrapper>
						<HeaderWrapper
							style={{ justifyContent: 'center', textAlign: 'center' }}
						>
							APY
						</HeaderWrapper>
						<HeaderWrapper
							style={{ justifyContent: 'center', textAlign: 'center' }}
						>
							Balance
						</HeaderWrapper>
						<HeaderWrapper
							style={{ justifyContent: 'flex-end', textAlign: 'end' }}
						>
							Collateral
						</HeaderWrapper>
					</TableHeader>
					<ItemContainer onClick={handleSupply}>
						<ItemWrapper>
							<img src="USDC.png" />
							<p>USDC</p>
						</ItemWrapper>
						<ItemWrapper
							style={{
								justifyContent: 'center',
								textAlign: 'center',
							}}
						>
							5.00%
						</ItemWrapper>
						<ItemWrapper
							style={{
								justifyContent: 'flex-end',
								textAlign: 'end',
							}}
						>
							500 USDC
						</ItemWrapper>
						<ItemWrapper
							style={{
								justifyContent: 'flex-end',
								textAlign: 'end',
							}}
						>
							<FormCheck type="switch" id="custom-switch" />
						</ItemWrapper>
					</ItemContainer>
					<MarketSummary>
						<MarketSummaryHeader>
							<MarketHeaderWrapper
								style={{
									justifyContent: 'flex-start',
									textAlign: 'start',
								}}
							>
								Total Collateral
							</MarketHeaderWrapper>
							<MarketHeaderWrapper
								style={{
									justifyContent: 'flex-end',
									textAlign: 'end',
								}}
							>
								Net APY
							</MarketHeaderWrapper>
						</MarketSummaryHeader>
						<MarketItemContainer>
							<MarketItemWrapper
								style={{ justifyContent: 'flex-start', textAlign: 'start' }}
							>
								$500
							</MarketItemWrapper>
							<MarketItemWrapper
								style={{ justifyContent: 'flex-end', textAlign: 'end' }}
							>
								5.00%
							</MarketItemWrapper>
						</MarketItemContainer>
					</MarketSummary>{' '}
				</MarketTable>
			</OverviewTableContainer>
		</>
	)
}

export const Borrowed: React.FC = () => {

	const [handleBorrow] = useModal(<MarketBorrowModal />)

	return (
		<>
			<OverviewTableContainer>
				<MarketTable>
					<TableHeader>
						<HeaderWrapper>Asset</HeaderWrapper>
						<HeaderWrapper
							style={{ justifyContent: 'center', textAlign: 'center' }}
						>
							APR
						</HeaderWrapper>
						<HeaderWrapper
							style={{ justifyContent: 'flex-end', textAlign: 'end' }}
						>
							Balance
						</HeaderWrapper>
					</TableHeader>
					<ItemContainer onClick={handleBorrow}>
						<ItemWrapper>
							<img src="USDC.png" />
							<p>USDC</p>
						</ItemWrapper>
						<ItemWrapper
							style={{
								justifyContent: 'center',
								textAlign: 'center',
							}}
						>
							5.00%
						</ItemWrapper>
						<ItemWrapper
							style={{
								justifyContent: 'flex-end',
								textAlign: 'end',
							}}
						>
							500 USDC
						</ItemWrapper>
					</ItemContainer>
					<MarketSummary>
						<MarketSummaryHeader>
							<MarketHeaderWrapper
								style={{
									justifyContent: 'flex-start',
									textAlign: 'start',
								}}
							>
								Total Debt
							</MarketHeaderWrapper>
							<MarketHeaderWrapper
								style={{
									justifyContent: 'flex-end',
									textAlign: 'end',
								}}
							>
								Net APR
							</MarketHeaderWrapper>
						</MarketSummaryHeader>
						<MarketItemContainer>
							<MarketItemWrapper
								style={{ justifyContent: 'flex-start', textAlign: 'start' }}
							>
								$500
							</MarketItemWrapper>
							<MarketItemWrapper
								style={{ justifyContent: 'flex-end', textAlign: 'end' }}
							>
								5.00%
							</MarketItemWrapper>
						</MarketItemContainer>
					</MarketSummary>
				</MarketTable>
			</OverviewTableContainer>
		</>
	)
}