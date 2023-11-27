import { XMLParser } from 'fast-xml-parser'
import { z } from 'zod'

const parser = new XMLParser({ ignoreAttributes: false })

const SidecarMarkerSchema = z.object({
	comment: z.string(),
	time: z.string(),
	duration: z.string(),
	cuePointName: z.string(),
	eventCuePoint: z.string(),
	chapter: z.string(),
	frameTarget: z.string(),
	url: z.string(),
	params: z.array(z.string()),
})

const SidecarSchema = z.object({
	general: z.object({
		version: z.number(),
	}),
	markers: z.array(SidecarMarkerSchema),
})

/**
 * @throws If the parsing fails, such as due to invalid input.
 */
export function parseSidecar(input: string): Sidecar | undefined {
	const parsedXml = parser.parse(input)
	return SidecarSchema.parse(parsedXml)
}

export function isValidSidecar(input: unknown): input is Sidecar {
	const result = SidecarSchema.safeParse(input)
	if (!result.success) {
		console.error('Invalid sidecar')
	}
	return result.success
}

/**
 * Takes a Sidecar XML string and turns it into a Sidecar object.
 * Supports multiple Sidecar XML formats.
 */
export function mangleSidecarXml(input: string): Sidecar | null {
	const parsed = parser.parse(input)
	if (!parsed.xml) return null
	const xml = parsed.xml

	const markers = [...ensureArray(xml['comp'])]

	const layers = xml['layers'] || []
	ensureArray(layers['layer']).forEach((layer) => {
		markers.push(layer)
	})

	const mangled = {
		general: {
			version: xml.general.version,
		},
		/**
		 * Markers can come from two places: layers and comps. We merge them here.
		 */
		markers: markers
			.filter(Boolean)
			.map((layerOrComp) => {
				const markers = ensureArray(layerOrComp['marker'])
					.filter(Boolean)
					.map((marker) => {
						return {
							comment: marker['comment']['@_value'],
							time: marker['time']['@_value'],
							duration: marker['duration']['@_value'],
							cuePointName: marker['cuePointName']['@_value'],
							eventCuePoint: marker['eventCuePoint']['@_value'],
							chapter: marker['chapter']['@_value'],
							frameTarget: marker['frameTarget']['@_value'],
							url: marker['url']['@_value'],
							params: ensureArray(marker['params']),
						}
					})

				return markers
			})
			.flat(),
	}

	mangled.markers.sort(sortMarkers)
	return mangled
}

function sortMarkers(a: SidecarMarker, b: SidecarMarker): number {
	if (parseFloat(a.time) < parseFloat(b.time)) return -1
	if (parseFloat(a.time) > parseFloat(b.time)) return 1
	return 0
}

function ensureArray<T>(v: T | T[]): T[] {
	return Array.isArray(v) ? v : [v]
}

export type Sidecar = z.infer<typeof SidecarSchema>
export type SidecarMarker = z.infer<typeof SidecarMarkerSchema>
