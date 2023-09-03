"use client"

import React, { useEffect, useState } from 'react'

export default function useOrigin() {
	const [isMounted, setMounted] = useState(false)

	const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ""


	useEffect(() => {
		setMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}
	return origin
}
