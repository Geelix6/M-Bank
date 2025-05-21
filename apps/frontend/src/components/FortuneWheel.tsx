import React, { useState, useRef, useEffect } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { fetchApi } from '../utils/fetchApi'
import { ErrorResponseDto } from '../dto/errorResponseDto'

const SECTORS = [3000, 5000, 10000, 20000, 50000, 100000, 250000, 1000000]
const SECTOR_ANGLE = 360 / SECTORS.length
const FULL_ROTATIONS = 5

const PRIZE_OFFSETS: Record<number, number> = {
  3000: 70,
  5000: 25,
  10000: 340,
  20000: 295,
  50000: 250,
  100000: 205,
  250000: 160,
  1000000: 115,
}

export const FortuneWheel: React.FC = () => {
  const { keycloak } = useKeycloak()
  const wheelRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [remainTime, setRemainTime] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState<string>('')

  // Fetch initial remain-time
  useEffect(() => {
    const loadRemain = async () => {
      try {
        const rt: Date = await fetchApi<Date>('/api/gifts/remain-time', {
          method: 'GET',
          token: keycloak.token,
        })
        setRemainTime(new Date(rt))
      } catch (e) {
        console.error(e)
      }
    }
    loadRemain()
  }, [keycloak.token])

  // Countdown timer
  useEffect(() => {
    if (!remainTime) return
    let id: number | undefined = undefined
    const tick = () => {
      const now = new Date()
      const diff = remainTime.getTime() - now.getTime()
      if (diff <= 0) {
        setRemainTime(null)
        setCountdown('')
        clearInterval(id)
        return
      }
      const hrs = Math.floor(diff / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setCountdown(
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      )
    }
    tick()
    id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [remainTime])

  const spin = async () => {
    if (spinning) return
    if (remainTime && remainTime.getTime() > Date.now()) return

    setSpinning(true)
    setResult(null)

    try {
      // Fetch prize
      const prize: number = await fetchApi<number>('/api/gifts', {
        method: 'GET',
        token: keycloak.token,
      })

      const offset = PRIZE_OFFSETS[prize]
      const currentMod = rotationRef.current % 360
      const deltaToZero = (360 - currentMod) % 360
      const extra = FULL_ROTATIONS * 360 + deltaToZero + offset
      rotationRef.current += extra

      if (wheelRef.current) {
        wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)'
        wheelRef.current.style.transform = `rotate(${rotationRef.current}deg)`

        const handleEnd = async () => {
          setResult(prize)
          setSpinning(false)
          wheelRef.current?.removeEventListener('transitionend', handleEnd)
          // Refresh remain-time
          try {
            const rt: Date = await fetchApi<Date>('/api/gifts/remain-time', {
              method: 'GET',
              token: keycloak.token,
            })
            setRemainTime(new Date(rt))
          } catch (e) {
            console.error(e)
          }
        }
        wheelRef.current.addEventListener('transitionend', handleEnd)
      }
    } catch (_e) {
      const e = _e as ErrorResponseDto
      console.error(e)
      setSpinning(false)
      alert(e.message || 'Ошибка при запросе')
    }
  }

  const buttonDisabled = spinning || (remainTime != null && remainTime.getTime() > Date.now())
  const buttonLabel = spinning
    ? 'Крутим колесо...'
    : remainTime && remainTime.getTime() > Date.now()
      ? `Доступно через ${countdown}`
      : 'Получить подарок'

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-64 w-64">
        {/* Arrow pointer */}
        <div
          className="absolute"
          style={{
            top: '4px',
            zIndex: 10,
            left: '50%',
            transform: 'translateX(-50%) rotate(180deg)',
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '20px solid red',
          }}
        />
        {/* Wheel */}
        <div
          ref={wheelRef}
          className="h-full w-full rounded-full border-4 border-gray-300"
          style={{
            background: `conic-gradient(
              #000 0deg ${SECTOR_ANGLE}deg,
              #111 ${SECTOR_ANGLE}deg ${SECTOR_ANGLE * 2}deg,
              #222 ${SECTOR_ANGLE * 2}deg ${SECTOR_ANGLE * 3}deg,
              #333 ${SECTOR_ANGLE * 3}deg ${SECTOR_ANGLE * 4}deg,
              #444 ${SECTOR_ANGLE * 4}deg ${SECTOR_ANGLE * 5}deg,
              #555 ${SECTOR_ANGLE * 5}deg ${SECTOR_ANGLE * 6}deg,
              #666 ${SECTOR_ANGLE * 6}deg ${SECTOR_ANGLE * 7}deg,
              #777 ${SECTOR_ANGLE * 7}deg 360deg
            )`,
          }}
        >
          {SECTORS.map((value, i) => {
            const angle = SECTOR_ANGLE * i + SECTOR_ANGLE / 2
            return (
              <div
                key={i}
                className="absolute font-bold text-white"
                style={{
                  width: '90%',
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${angle}deg) translate(-50%, -100%)`,
                  transformOrigin: '0 0',
                }}
              >
                {value.toLocaleString()} ₽
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={spin}
        disabled={buttonDisabled}
        className={`${buttonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} mt-6 w-64 rounded bg-blue-500 px-6 py-2 text-white disabled:opacity-50`}
      >
        {buttonLabel}
      </button>

      {result != null && (
        <p className="mt-4 text-xl font-semibold">Вы выиграли {result.toLocaleString()} ₽!</p>
      )}
    </div>
  )
}
