#include "aster/book.hpp"
#include <sstream>
#include <iomanip>
#include <iostream>
#include <iterator>

// Only the portable framing, decoder and book are compiled. No Linux file IO.
extern "C" const char* replay(const unsigned char* bytes, int length, int target) {
    static std::string result;
    try {
        if(length < 0 || length > 65536 || target < 0 || target > 512)
            throw std::runtime_error("fixture bounds exceeded");
        aster::Frames frames({reinterpret_cast<const std::byte*>(bytes), static_cast<size_t>(length)});
        aster::Frame frame;
        aster::Book book;
        int applied=0;
        // Always frame and decode the complete fixture, including its suffix.
        while(frames.next(frame)) {
            const auto event=aster::decode(frame);
            if(applied < target) book.apply(event);
            if(++applied > 512) throw std::runtime_error("too many frames");
        }
        if(target > applied) throw std::runtime_error("timeline outside fixture");
        book.validate();
        std::ostringstream out;
        out << "{\"step\":" << target << ",\"total\":" << applied
            << ",\"orders\":" << book.orders() << ",\"hash\":\"" << std::hex
            << std::setw(16) << std::setfill('0') << book.digest() << std::dec
            << "\",\"levels\":[";
        bool first=true;
        for(char side : {'B','S'}) for(const auto& level : book.levels(1,side)) {
            if(!first) out << ','; first=false;
            out << "{\"side\":\"" << side << "\",\"price4\":" << level.price4
                << ",\"shares\":\"" << level.shares << "\",\"fifo\":[";
            bool first_order=true;
            for(const auto& order : level.fifo) {
                if(!first_order) out << ','; first_order=false;
                out << "{\"id\":\"" << order.id << "\",\"shares\":" << order.shares << '}';
            }
            out << "]}";
        }
        out << "]}";
        result=out.str();
    } catch(const std::exception&) {
        result="{\"error\":\"Fixture rejected by ASTER framing, decoder or book validation.\"}";
    }
    return result.c_str();
}
#ifdef ASTER_NATIVE_CHECK
int main(int argc,char** argv) {
    std::vector<unsigned char> bytes(std::istreambuf_iterator<char>(std::cin),{});
    std::cout << replay(bytes.data(),bytes.size(),argc>1?std::stoi(argv[1]):0) << '\n';
}
#endif
