import { Modal } from '../ui/Modal'
import { ShareCard } from './ShareCard'

type Props = { presentationId: string; open: boolean; onClose: () => void }

export function ShareModal({ presentationId, open, onClose }: Props) {
  return (
    <Modal open={open} title="Invite players" onClose={onClose}>
      <ShareCard presentationId={presentationId} compact />
    </Modal>
  )
}
