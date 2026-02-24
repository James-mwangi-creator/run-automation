"""
Sample File Organizer Script
This demonstrates how automation scripts work in Run-automation
"""

import os
import json
from datetime import datetime

def run_automation(input_data):
    """
    Main automation function that gets called from the Android app
    
    Args:
        input_data: JSON string or plain text input from user
    
    Returns:
        Result string or JSON that will be displayed to user
    """
    try:
        # Parse input if it's JSON
        try:
            data = json.loads(input_data) if input_data else {}
        except:
            data = {"input": input_data}
        
        # Example automation: Process files
        results = []
        results.append("🚀 Starting automation...")
        results.append(f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        results.append(f"📝 Input received: {len(input_data)} characters")
        
        # Simulate some processing
        results.append("\n✅ Processing complete!")
        results.append(f"📊 Status: Success")
        
        # Return results
        return "\n".join(results)
        
    except Exception as e:
        return f"❌ Error: {str(e)}"

# For testing locally
if __name__ == "__main__":
    test_input = '{"action": "test", "count": 5}'
    result = run_automation(test_input)
    print(result)
