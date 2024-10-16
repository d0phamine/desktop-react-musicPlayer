import { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"

import { useStores } from "../../../store"
import { CustomIcon, CustomListItem, BrowserSearch } from "../.."

import {
	MdFolder,
	MdOutlineKeyboardBackspace,
	MdOutlineStarPurple500,
	MdOutlineAudioFile,
} from "react-icons/md"
import { Button } from "antd"

import "./index.scss"

export const FileBrowser: FC = observer(() => {
	const { FSstore, ComponentStore, PlayerStore } = useStores()

	useEffect(() => {
		FSstore.getDirs()
	}, [])

	return (
		<div className="file-browser">
			<div className="file-browser__controls">
				<Button
					disabled={
						FSstore.FSdata.homePath === FSstore.FSdata.currentPath
					}
					icon={<MdOutlineKeyboardBackspace />}
					onClick={() => {
						FSstore.clearFilteredDirs()
						ComponentStore.clearBrowserSearchValue()
						FSstore.getDirs(FSstore.FSdata.previousPath)
					}}
				/>
				<BrowserSearch placeholder={FSstore.FSdata.currentPath} />
			</div>
			<div className="file-browser__list">
				{(FSstore.FSdata.filteredDirs
					? FSstore.FSdata.filteredDirs
					: FSstore.FSdata.dirs
				)?.map((item: any, index) => (
					<CustomListItem
						key={index}
						title={item.name}
						button={
							item.type === "directory" ? (
								<MdFolder />
							) : (
								<MdOutlineAudioFile />
							)
						}
						onClick={() => {
							if (item.type === "directory") {
								FSstore.clearFilteredDirs()
								ComponentStore.clearBrowserSearchValue()
								FSstore.getDirs(item.path)
							} else {
								PlayerStore.addTrackToCurrentPlaylist(item)
								console.log(PlayerStore.playerData.currentPlaylist)
							}
						}}
						control={
							item.type === "directory" ? (
								<CustomIcon
									onClick={() =>
										FSstore.addToFavoriteDirs(item.path)
									}
								>
									<MdOutlineStarPurple500
										style={
											FSstore.FSdata.favoriteDirs.some(
												(dir: any) =>
													dir.path === item.path,
											)
												? { color: "gold" }
												: { color: "white" }
										}
									/>
								</CustomIcon>
							) : null
						}
						customClass="hover-control"
					/>
				))}
			</div>
		</div>
	)
})

