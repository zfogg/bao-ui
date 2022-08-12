import Config from '@/bao/lib/config'
import { ActiveSupportedMarket } from '@/bao/lib/types'
import { approvev2 } from '@/bao/utils'
import { ButtonStack, SubmitButton } from '@/components/Button/Button'
import useTransactionHandler from '@/hooks/base/useTransactionHandler'
import { useApprovals } from '@/hooks/markets/useApprovals'
import { decimate } from '@/utils/numberFormat'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Link from 'next/link'
import React from 'react'
import { MarketOperations } from './Modals/Modals'

type MarketButtonProps = {
	operation: MarketOperations
	asset: ActiveSupportedMarket
	val: BigNumber
	isDisabled: boolean
	onHide: () => void
}

export const MarketButton = ({ operation, asset, val, isDisabled, onHide }: MarketButtonProps) => {
	const { pendingTx, handleTx } = useTransactionHandler()
	const { account } = useWeb3React()
	const { approvals } = useApprovals(pendingTx)

	const { marketContract } = asset

	if (pendingTx) {
		return (
			<ButtonStack>
				<SubmitButton disabled={true}>
					{typeof pendingTx === 'string' ? (
						<Link href={`${Config.defaultRpc.blockExplorerUrls}/tx/${pendingTx}`} target='_blank'>
							<a>
								Pending Transaction <FontAwesomeIcon icon={faExternalLinkAlt} />
							</a>
						</Link>
					) : (
						'Pending Transaction'
					)}
				</SubmitButton>
			</ButtonStack>
		)
	} else {
		switch (operation) {
			case MarketOperations.supply:
				return (
					<ButtonStack>
						{approvals && (asset.underlyingAddress === 'ETH' || approvals[asset.underlyingAddress].gt(0)) ? (
							<SubmitButton
								disabled={isDisabled}
								onClick={() => {
									let mintTx
									if (asset.underlyingAddress === 'ETH')
										mintTx = marketContract.methods
											.mint(true) // TODO- Give the user the option in the SupplyModal to tick collateral on/off
											.send({ from: account, value: val.toString() })
									else
										mintTx = marketContract.methods
											.mint(val.toString(), true) // TODO- Give the user the option in the SupplyModal to tick collateral on/off
											.send({ from: account })
									handleTx(mintTx, `Supply ${decimate(val, asset.underlyingDecimals).toFixed(4)} ${asset.underlyingSymbol}`, () => onHide())
								}}
							>
								Supply
							</SubmitButton>
						) : (
							<SubmitButton
								disabled={!approvals}
								onClick={() => {
									const { underlyingContract } = asset
									handleTx(approvev2(underlyingContract, marketContract, account), `Approve ${asset.underlyingSymbol} for Markets`)
								}}
							>
								Approve {asset.underlyingSymbol}
							</SubmitButton>
						)}
					</ButtonStack>
				)

			case MarketOperations.withdraw:
				return (
					<ButtonStack>
						<SubmitButton
							disabled={isDisabled}
							onClick={() => {
								handleTx(
									marketContract.methods.redeemUnderlying(val.toString()).send({ from: account }),
									`Withdraw ${decimate(val, asset.underlyingDecimals).toFixed(4)} ${asset.underlyingSymbol}`,
									() => onHide(),
								)
							}}
						>
							Withdraw
						</SubmitButton>
					</ButtonStack>
				)

			case MarketOperations.mint:
				return (
					<SubmitButton
						disabled={isDisabled}
						onClick={() => {
							handleTx(
								marketContract.methods.borrow(val.toString()).send({ from: account }),
								`Mint ${decimate(val, asset.underlyingDecimals).toFixed(4)} ${asset.symbol}`,
								() => onHide(),
							)
						}}
					>
						Mint
					</SubmitButton>
				)

			case MarketOperations.repay:
				return (
					<ButtonStack>
						{approvals && (asset.underlyingAddress === 'ETH' || approvals[asset.underlyingAddress].gt(0)) ? (
							<SubmitButton
								disabled={isDisabled}
								onClick={() => {
									let repayTx
									if (asset.underlyingAddress === 'ETH')
										repayTx = marketContract.methods.repayBorrow().send({ from: account, value: val.toString() })
									else repayTx = marketContract.methods.repayBorrow(val.toString()).send({ from: account })
									handleTx(repayTx, `Repay ${decimate(val, asset.underlyingDecimals).toFixed(4)} ${asset.underlyingSymbol}`, () => onHide())
								}}
							>
								Repay
							</SubmitButton>
						) : (
							<SubmitButton
								disabled={!approvals}
								onClick={() => {
									const { underlyingContract } = asset
									handleTx(approvev2(underlyingContract, marketContract, account), `Approve ${asset.underlyingSymbol} for Markets`)
								}}
							>
								Approve {asset.underlyingSymbol}
							</SubmitButton>
						)}
					</ButtonStack>
				)
		}
	}
}
