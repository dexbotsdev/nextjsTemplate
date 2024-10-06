'use client'

import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from 'ui'
import { getActivityLogs } from '@/core/server/actions/users/fetch-activity'
import { ActivityLog } from '@/lib/db/schema/activity'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const ActivityFeed = () => {
	const [activities, setActivities] = useState<ActivityLog[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [searchTerm, setSearchTerm] = useState('')
	const itemsPerPage = 10

	useEffect(() => {
		fetchActivities()
	}, [])

	async function fetchActivities() {
		try {
			setIsLoading(true)
			const logs = await getActivityLogs()
			setActivities(logs)
			setError(null)
		} catch (error) {
			console.error('Failed to fetch activity logs:', error)
			setError('Failed to load activity logs. Please try again later.')
		} finally {
			setIsLoading(false)
		}
	}

	const filteredActivities = activities.filter(
		activity =>
			activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(activity.details &&
				activity.details
					.toLowerCase()
					.includes(searchTerm.toLowerCase()))
	)

	const paginatedActivities = filteredActivities.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)

	if (isLoading) {
		return <div className="text-center py-4">Loading activity feed...</div>
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		)
	}

	return (
		<div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-900">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Activity Feed</h2>
				<div className="flex items-center space-x-2">
					<Input
						type="text"
						placeholder="Search activities..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className="w-64"
					/>
					<Button
						onClick={fetchActivities}
						variant="outline"
						size="sm"
					>
						Refresh
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Activities
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{activities.length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Unique Actions
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{new Set(activities.map(a => a.action)).size}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Latest Activity
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{activities.length > 0
								? new Date(
										activities[0].timestamp
									).toLocaleString()
								: 'N/A'}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Activities Today
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{
								activities.filter(
									a =>
										new Date(a.timestamp).toDateString() ===
										new Date().toDateString()
								).length
							}
						</div>
					</CardContent>
				</Card>
			</div>

			{activities.length === 0 ? (
				<p>No activities found.</p>
			) : (
				<>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Action</TableHead>
								<TableHead>Details</TableHead>
								<TableHead>Timestamp</TableHead>
								<TableHead>Metadata</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedActivities.map(activity => (
								<TableRow key={activity.id}>
									<TableCell>{activity.action}</TableCell>
									<TableCell>
										{activity.details || 'N/A'}
									</TableCell>
									<TableCell>
										{new Date(
											activity.timestamp
										).toLocaleString()}
									</TableCell>
									<TableCell>
										{activity.metadata ? (
											<Button
												variant="link"
												size="sm"
												onClick={() =>
													alert(
														JSON.stringify(
															activity.metadata,
															null,
															2
														)
													)
												}
											>
												View Metadata
											</Button>
										) : (
											'N/A'
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onClick={() =>
										setCurrentPage(prev =>
											Math.max(prev - 1, 1)
										)
									}
									className={
										currentPage === 1
											? 'pointer-events-none opacity-50'
											: ''
									}
								/>
							</PaginationItem>
							{[...Array(totalPages)].map((_, i) => (
								<PaginationItem key={i}>
									<PaginationLink
										onClick={() => setCurrentPage(i + 1)}
										isActive={currentPage === i + 1}
									>
										{i + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									onClick={() =>
										setCurrentPage(prev =>
											Math.min(prev + 1, totalPages)
										)
									}
									className={
										currentPage === totalPages
											? 'pointer-events-none opacity-50'
											: ''
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</>
			)}
		</div>
	)
}

export default ActivityFeed
