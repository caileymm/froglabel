function DatasetPanel() {
    return (
        // Changed flex-column to flex-col and added w-full
        <div className='flex flex-col items-center justify-center w-full'>

            <div className='bg-[#F3F3E4] rounded-xl flex items-center justify-center w-[80%] mx-auto p-3 my-2'>
                <div className='font-display text-md flex items-center justify-center space-x-10'>
                    <div> # </div>
                    <div> Code </div>
                    <div> Name </div>
                </div>
                
                <div className='flex-1'></div>

                <div className='font-display text-md flex items-center justify-center space-x-10'>
                    <div> Start Time (s) </div>
                    <div> End Time (s) </div>
                    <div> Start Frequency (Hz) </div>
                    <div> End Frequency (Hz) </div>
                </div>
            </div>
        </div>
    )
}

export default DatasetPanel;